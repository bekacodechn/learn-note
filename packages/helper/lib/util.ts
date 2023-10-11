export const delay = (time: number, value?: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, time);
  });
};

export const logTime = async (cb, name?: string) => {
  if (typeof cb !== "function") throw new TypeError("not function");
  name = name || "time => ";

  console.time(name);
  const result = await cb();
  console.timeEnd(name);

  return result;
};
