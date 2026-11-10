import { ConfigService } from "@nestjs/config";
import { Worker } from "bullmq";
import IORedis from "ioredis";

import { QueueService } from "./queue.service";
import { QUEUE_NAMES } from "./queue.types";

// Opt in only against a dedicated local Redis instance; never use a shared database.
const redisUrl = process.env.QUEUE_TEST_REDIS_URL;
const describeRedis = redisUrl ? describe : describe.skip;

describeRedis("queue service with a 50-connection Redis limit", () => {
  it("keeps overlapping deployments below the limit and starts queued work after the old instance retires", async () => {
    if (redisUrl !== "redis://127.0.0.1:56379")
      throw new Error("Use the isolated local test Redis");
    const monitor = new IORedis(redisUrl);
    const config = new ConfigService({ redis: { REDIS_URL: redisUrl } });
    const previous = process.env.QUEUE_ROLLOUT_CONNECTION_GATE;
    delete process.env.QUEUE_ROLLOUT_CONNECTION_GATE;
    const oldService = new QueueService(config);
    process.env.QUEUE_ROLLOUT_CONNECTION_GATE = "true";
    const newService = new QueueService(config);
    if (previous === undefined) delete process.env.QUEUE_ROLLOUT_CONNECTION_GATE;
    else process.env.QUEUE_ROLLOUT_CONNECTION_GATE = previous;
    const oldWorkers: Worker[] = [];
    const newWorkers: Worker[] = [];
    let oldClosed = false;
    try {
      oldService.onModuleInit();
      newService.onModuleInit();
      for (const name of Object.values(QUEUE_NAMES)) {
        oldWorkers.push(
          new Worker(name, async () => "old", { connection: oldService.getConnection() }),
        );
        newWorkers.push(
          new Worker(
            name,
            async (job) => {
              if (job.attemptsMade === 0) throw new Error("Expected retry after rollout");
              return "new";
            },
            { connection: newService.getConnection() },
          ),
        );
      }
      await Promise.all(oldWorkers.map((w) => w.waitUntilReady()));
      await newService.getQueue(QUEUE_NAMES.LEARNING_TIME).waitUntilReady();
      newService.startWorkersAfterHttpReady();
      const before = ((await monitor.client("LIST")) as string).trim().split("\n").length;
      expect(before).toBeGreaterThan(20);
      expect(before).toBeLessThan(35);
      const events = newService.getQueueEvents(QUEUE_NAMES.LEARNING_TIME);
      await events.waitUntilReady();
      const handoverJob = await newService.enqueue(
        QUEUE_NAMES.LEARNING_TIME,
        "handover",
        {},
        { removeOnComplete: true },
      );
      await expect(handoverJob.waitUntilFinished(events, 10000)).resolves.toBe("old");
      await Promise.all(oldWorkers.map((w) => w.close()));
      await oldService.onModuleDestroy();
      await oldService.onApplicationShutdown();
      oldClosed = true;
      await Promise.all(newWorkers.map((w) => w.waitUntilReady()));
      const job = await newService.enqueue(
        QUEUE_NAMES.LEARNING_TIME,
        "rollout",
        {},
        { attempts: 2, removeOnComplete: true },
      );
      await expect(job.waitUntilFinished(events, 10000)).resolves.toBe("new");
      const after = ((await monitor.client("LIST")) as string).trim().split("\n").length;
      expect(after).toBeLessThan(35);
    } finally {
      await Promise.all(newWorkers.map((w) => w.close()));
      await newService.onModuleDestroy();
      await newService.onApplicationShutdown();
      if (!oldClosed) {
        await Promise.all(oldWorkers.map((w) => w.close()));
        await oldService.onModuleDestroy();
        await oldService.onApplicationShutdown();
      }
      await monitor.quit();
    }
  }, 30000);

  it("can shut down a gated worker before HTTP readiness without opening a blocking socket", async () => {
    if (redisUrl !== "redis://127.0.0.1:56379")
      throw new Error("Use the isolated local test Redis");
    const previous = process.env.QUEUE_ROLLOUT_CONNECTION_GATE;
    process.env.QUEUE_ROLLOUT_CONNECTION_GATE = "true";
    const service = new QueueService(new ConfigService({ redis: { REDIS_URL: redisUrl } }));
    if (previous === undefined) delete process.env.QUEUE_ROLLOUT_CONNECTION_GATE;
    else process.env.QUEUE_ROLLOUT_CONNECTION_GATE = previous;
    service.onModuleInit();
    const worker = new Worker(QUEUE_NAMES.LEARNING_TIME, async () => 1, {
      connection: service.getConnection(),
    });
    await service.getQueue(QUEUE_NAMES.LEARNING_TIME).waitUntilReady();
    await worker.close();
    await service.onModuleDestroy();
    await service.onApplicationShutdown();
  });

  it("runs all queue workers, observes completion and retries, then releases shared clients", async () => {
    if (redisUrl !== "redis://127.0.0.1:56379")
      throw new Error("Use the isolated local test Redis");
    const monitor = new IORedis(redisUrl);
    const service = new QueueService(new ConfigService({ redis: { REDIS_URL: redisUrl } }));
    const workers: Worker[] = [];
    try {
      service.onModuleInit();
      for (const name of Object.values(QUEUE_NAMES)) {
        workers.push(
          new Worker(
            name,
            async (job) => {
              if (job.data.retry && job.attemptsMade === 0) throw new Error("Expected retry");
              return job.data.value;
            },
            { connection: service.getConnection() },
          ),
        );
      }
      await Promise.all(workers.map((worker) => worker.waitUntilReady()));
      const events = service.getQueueEvents(QUEUE_NAMES.LEARNING_TIME);
      await events.waitUntilReady();
      expect(service.getQueueEvents(QUEUE_NAMES.LEARNING_TIME)).toBe(events);
      const clients = ((await monitor.client("LIST")) as string).trim().split("\n").length;
      expect(clients).toBeLessThan(35);
      const job = await service.enqueue(
        QUEUE_NAMES.LEARNING_TIME,
        "connection-check",
        { value: 42, retry: true },
        { attempts: 2, removeOnComplete: true },
      );
      await expect(job.waitUntilFinished(events, 10000)).resolves.toBe(42);
      expect(job.attemptsMade).toBeLessThanOrEqual(2);
    } finally {
      await Promise.all(workers.map((worker) => worker.close()));
      await service.onModuleDestroy();
      await service.onApplicationShutdown();
      const clients = ((await monitor.client("LIST")) as string).trim().split("\n").length;
      await monitor.quit();
      expect(clients).toBe(1);
    }
  });
});
