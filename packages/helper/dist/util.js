export const delay = (time, value) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value);
        }, time);
    });
};
