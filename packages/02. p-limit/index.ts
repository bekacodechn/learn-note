import Queue from "yocto-queue";

const queue = new Queue();
const resolves = new Set<Function>(); // 记录resolve，用于取消pending任务
let activeCount = 0;

const clear = () => {
  queue.clear();
  resolves.clear();
};

export default function PLimit(concurrency) {
  if (
    !(
      (Number.isInteger(concurrency) ||
        concurrency === Number.POSITIVE_INFINITY) &&
      concurrency > 0
    )
  ) {
    throw new TypeError("concurrency 要求是正整数");
  }

  const next = () => {
    activeCount--;

    if (queue.size > 0) {
      // @ts-expect-error
      queue.dequeue()();
    } else {
      clear();
    }
  };

  const run = async (fn, resolve, args) => {
    activeCount++;

    const promise = Promise.resolve(fn(...args));
    resolve(promise);

    try {
      await promise;
    } catch {}

    resolves.delete(resolve);

    next();
  };

  const enqueue = (fn, resolve, args) => {
    queue.enqueue(run.bind(undefined, fn, resolve, args));

    (async () => {
      await Promise.resolve();

      // 限制并发数
      if (activeCount < concurrency && queue.size > 0) {
        // @ts-expect-error
        queue.dequeue()();
      }
    })();
  };

  const generate = (fn, ...args) => {
    return new Promise((resolve) => {
      resolves.add(resolve);

      enqueue(fn, resolve, args);
    });
  };

  Object.defineProperties(generate, {
    activeCount: {
      get: () => activeCount,
    },
    pendingCount: {
      get: () => queue.size,
    },
    // 清除队列，取消任务
    clearQueue: {
      value: () => clear(),
    },
    // 清除剩余队列，返回已完成部分，未完成填充undefined
    clearPending: {
      value() {
        resolves.forEach((resolve) => resolve());
        clear();
      },
    },
  });

  return generate;
}
