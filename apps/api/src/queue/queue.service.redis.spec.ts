import { ConfigService } from "@nestjs/config";
import { Worker } from "bullmq";
import IORedis from "ioredis";

import { QueueService } from "./queue.service";
import { QUEUE_NAMES } from "./queue.types";

// Opt in only against a dedicated local Redis instance; never use a shared database.
const redisUrl = process.env.QUEUE_TEST_REDIS_URL;
const describeRedis = redisUrl ? describe : describe.skip;

describeRedis("queue service with a 50-connection Redis limit", () => {
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
