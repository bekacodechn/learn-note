export const delay = (time: number, value?: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, time);
  });
};

export const logTime = async (name: string | Function, cb?: Function) => {
  if (typeof name === 'string') {
    name = name || 'time =>'
  } else if (typeof name === 'function')  {
    cb = name;
    name = 'time =>'
  }
  if (typeof name !== 'string' || typeof cb !== 'function') {
    throw new Error('参数错误')
  }

  console.time(name);
  const result = await cb();
  console.timeEnd(name);

  return result;
};
