const createAbortError = () => {
  const error = new Error("Delay aborted");
  error.name = "AbortError";
  return error;
};

type Timeout = {
  clearTimeout?: typeof setTimeout | Function;
  setTimeout?: typeof clearTimeout | Function;
};

type Option = {
  value?: any;
  signal?: AbortSignal;
};

const clearMethods = new WeakMap();

export function createDelay({
  clearTimeout: defaultClear,
  setTimeout: defaultSet,
}: Timeout = {}) {
  return (milliseconds, { value, signal }: Option = {}) => {
    if (signal?.aborted) {
      return Promise.reject(createAbortError());
    }

    let timeoutId;
    let settle;
    let rejectFn;
    const clear = defaultClear ?? clearTimeout;

    const signalListener = () => {
      clear(timeoutId);
      rejectFn(createAbortError());
    };

    const cleanUp = () => {
      if (signal) {
        signal.removeEventListener("abort", signalListener);
      }
    };

    const delayPromise = new Promise((resolve, reject) => {
      settle = () => {
        cleanUp();
        resolve(value);
      };

      rejectFn = reject;
      timeoutId = (defaultSet ?? setTimeout)(settle, milliseconds);
    });

    // 监听abort
    if (signal) {
      signal.addEventListener("abort", signalListener, { once: true });
    }

    // weakMap => [promise, () => {}]
    clearMethods.set(delayPromise, () => {
      clear(timeoutId);
      timeoutId = null;
      settle();
    });

    return delayPromise;
  };
}

const delay = createDelay();

export default delay;

export function clearDelay(promise) {
  clearMethods.get(promise)?.();
}

const randomInteger = (minimum, maximum) => {
  return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
};

export function rangeDelay(minimum, maximum, options = {}) {
  return delay(randomInteger(minimum, maximum), options);
}
