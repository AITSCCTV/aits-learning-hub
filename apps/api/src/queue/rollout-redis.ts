import IORedis, { RedisOptions } from "ioredis";

/** Delay only BullMQ's duplicated blocking sockets; producers remain usable. */
class GatedRedis extends IORedis {
  private cancelled = false;
  private connectionStarted = false;
  private cancelWait: () => void = () => undefined;
  private readonly cancellation = new Promise<void>((resolve) => {
    this.cancelWait = resolve;
  });

  constructor(
    options: RedisOptions,
    private readonly ready: Promise<void>,
  ) {
    super({ ...options, lazyConnect: true });
  }

  override async connect(): Promise<void> {
    await Promise.race([this.ready, this.cancellation]);
    if (!this.cancelled) {
      this.connectionStarted = true;
      await super.connect();
    }
  }

  override disconnect(reconnect?: boolean): void {
    if (!this.connectionStarted) {
      this.cancelled = true;
      this.cancelWait();
    }
    super.disconnect(reconnect);
  }
}

export class RolloutRedis extends IORedis {
  constructor(
    url: string,
    private readonly blockingReady: Promise<void>,
  ) {
    super(url, { maxRetriesPerRequest: null });
  }

  override duplicate(overrides?: Partial<RedisOptions>): IORedis {
    return new GatedRedis({ ...this.options, ...overrides }, this.blockingReady);
  }
}
