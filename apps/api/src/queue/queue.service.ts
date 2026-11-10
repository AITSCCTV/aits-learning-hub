import {
  Injectable,
  Logger,
  type OnApplicationShutdown,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type Job, type JobsOptions, type ConnectionOptions, Queue, QueueEvents } from "bullmq";
import IORedis from "ioredis";

import { QUEUE_NAMES, type QueueName } from "src/queue/queue.types";

import { RolloutRedis } from "./rollout-redis";

import type { RedisConfigSchema } from "src/common/configuration/redis";

interface QueueInstance {
  queue: Queue;
  events?: QueueEvents;
}

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown {
  private readonly logger = new Logger(QueueService.name);
  private queues: Map<QueueName, QueueInstance> = new Map();
  private readonly connection: IORedis;
  private readonly producerConnection: IORedis;
  private releaseBlocking: () => void = () => undefined;
  private readonly blockingReady = new Promise<void>((resolve) => {
    this.releaseBlocking = resolve;
  });
  private readonly deferBlocking = process.env.QUEUE_ROLLOUT_CONNECTION_GATE === "true";
  private rolloutTimer?: ReturnType<typeof setTimeout>;
  private stopping = false;

  constructor(private readonly configService: ConfigService) {
    const redisCfg = this.configService.get("redis") as RedisConfigSchema | undefined;
    if (!redisCfg?.REDIS_URL) {
      throw new Error("Redis configuration is required for QueueService");
    }

    // Workers may wait for Redis recovery; HTTP producers should fail promptly.
    this.connection = this.deferBlocking
      ? new RolloutRedis(redisCfg.REDIS_URL, this.blockingReady)
      : new IORedis(redisCfg.REDIS_URL, { maxRetriesPerRequest: null });
    this.producerConnection = new IORedis(redisCfg.REDIS_URL, { maxRetriesPerRequest: 1 });
    this.connection.on("error", () => this.logger.error("Queue worker Redis connection failed"));
    this.producerConnection.on("error", () =>
      this.logger.error("Queue producer Redis connection failed"),
    );
  }

  onModuleInit() {
    for (const name of Object.values(QUEUE_NAMES)) {
      this.initializeQueue(name);
    }
  }

  private initializeQueue(name: QueueName): QueueInstance {
    const existing = this.queues.get(name);
    if (existing) return existing;

    const queue = new Queue(name, { connection: this.producerConnection });
    queue.on("error", () => this.logger.error(`Queue ${name} connection failed`));

    const instance = { queue };
    this.queues.set(name, instance);

    return instance;
  }

  getQueue(name: QueueName): Queue {
    const instance = this.queues.get(name);
    if (!instance) {
      throw new Error(`Queue ${name} not initialized`);
    }

    return instance.queue;
  }

  getQueueEvents(name: QueueName): QueueEvents {
    const instance = this.queues.get(name);
    if (!instance) {
      throw new Error(`Queue ${name} not initialized`);
    }

    // QueueEvents uses a dedicated blocking connection. Most queues never need it.
    if (!instance.events) {
      // Completion listeners must observe jobs still running on the previous instance.
      instance.events = new QueueEvents(name, {
        connection: { ...this.connection.options, maxRetriesPerRequest: null },
      });
      instance.events.on("error", () => this.logger.error(`Queue ${name} event connection failed`));
    }
    return instance.events;
  }

  async enqueue<T>(
    queueName: QueueName,
    jobName: string,
    data: T,
    options?: JobsOptions,
  ): Promise<Job<T>> {
    const queue = this.getQueue(queueName);

    return queue.add(jobName, data, options);
  }

  async waitForJobsCompletion(queueName: QueueName, jobs: Job[]) {
    const events = this.getQueueEvents(queueName);
    await events.waitUntilReady();

    return Promise.allSettled(jobs.map((j) => j.waitUntilFinished(events)));
  }

  getConnection(): ConnectionOptions {
    return this.connection;
  }

  /** Called after HTTP is listening, allowing Render to retire the old instance first. */
  startWorkersAfterHttpReady() {
    if (!this.deferBlocking) return;
    const checkCapacity = async () => {
      if (this.stopping) return;
      try {
        const info = await this.connection.info("clients");
        const count = Number(info.match(/^connected_clients:(\d+)/m)?.[1]);
        // Reserve room for all 24 queue workers plus event consumers under maxclients=50.
        if (Number.isFinite(count) && count <= 20) {
          this.logger.log("Redis rollout capacity available; starting background workers");
          this.releaseBlocking();
          return;
        }
      } catch {
        this.logger.warn("Waiting for Redis rollout capacity");
      }
      if (!this.stopping) this.rolloutTimer = setTimeout(() => void checkCapacity(), 5000);
    };
    void checkCapacity();
  }

  async onModuleDestroy() {
    this.stopping = true;
    if (this.rolloutTimer) clearTimeout(this.rolloutTimer);
    const closePromises: Promise<void>[] = [];

    for (const instance of this.queues.values()) {
      closePromises.push(instance.queue.close());
      if (instance.events) closePromises.push(instance.events.close());
    }

    await Promise.all(closePromises);
  }

  async onApplicationShutdown() {
    // All workers finish onModuleDestroy before shared connections are closed.
    await Promise.all([this.connection.quit(), this.producerConnection.quit()]);
  }
}
