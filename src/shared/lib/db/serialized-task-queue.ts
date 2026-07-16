export type SerializedTaskQueue = Readonly<{
  run: <Result>(task: () => Promise<Result>) => Promise<Result>;
}>;

export function createSerializedTaskQueue(): SerializedTaskQueue {
  let tail: Promise<void> = Promise.resolve();

  return {
    run<Result>(task: () => Promise<Result>): Promise<Result> {
      const result = tail.then(task);
      tail = result.then(
        () => undefined,
        () => undefined,
      );
      return result;
    },
  };
}
