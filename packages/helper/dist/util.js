export const delay = (time, value) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value);
        }, time);
    });
};
export const logTime = async (cb, name) => {
    if (typeof cb !== "function")
        throw new TypeError("not function");
    name = name || "time => ";
    console.time(name);
    const result = await cb();
    console.timeEnd(name);
    return result;
};
