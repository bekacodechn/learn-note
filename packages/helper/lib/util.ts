export const delay = (time: number, value?: any) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(value);
		}, time);
	});
};

