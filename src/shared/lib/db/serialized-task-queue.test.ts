import { createSerializedTaskQueue } from "./serialized-task-queue";

function createDeferred(): Readonly<{
  promise: Promise<void>;
  resolve: () => void;
}> {
  let resolvePromise: (() => void) | undefined;
  const promise = new Promise<void>((resolve) => {
    resolvePromise = resolve;
  });
  if (!resolvePromise) throw new Error("Deferred promise was not initialized.");
  return { promise, resolve: resolvePromise };
}

describe("serialized task queue", () => {
  it("starts the next task only after the active task settles", async () => {
    const queue = createSerializedTaskQueue();
    const firstTask = createDeferred();
    const events: string[] = [];

    const first = queue.run(async () => {
      events.push("first:start");
      await firstTask.promise;
      events.push("first:end");
    });
    const second = queue.run(async () => {
      events.push("second:start");
    });

    await Promise.resolve();
    expect(events).toEqual(["first:start"]);

    firstTask.resolve();
    await Promise.all([first, second]);
    expect(events).toEqual(["first:start", "first:end", "second:start"]);
  });

  it("continues after a task rejects", async () => {
    const queue = createSerializedTaskQueue();

    await expect(
      queue.run(async () => {
        throw new Error("write failed");
      }),
    ).rejects.toThrow("write failed");
    await expect(queue.run(async () => "next write")).resolves.toBe(
      "next write",
    );
  });
});
