export const delay = (time, value) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value);
        }, time);
    });
};
export const logTime = async (name, cb) => {
    if (typeof name === 'string') {
        name = name || 'time =>';
    }
    else if (typeof name === 'function') {
        cb = name;
        name = 'time =>';
    }
    if (typeof name !== 'string' || typeof cb !== 'function') {
        throw new Error('参数错误');
    }
    console.time(name);
    const result = await cb();
    console.timeEnd(name);
    return result;
};
