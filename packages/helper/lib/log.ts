import chalk from "chalk";

export const logSplit = (count = 30, str = "=") => {
	return () => {
		console.log(str.repeat(count) + '\n');
	};
};


export const logTime = async (name: string | Function, cb?: Function) => {
	if (typeof name === "string") {
		name = name || "time =>";
	} else if (typeof name === "function") {
		cb = name;
		name = "time ";
	}
	if (typeof name !== "string" || typeof cb !== "function") {
		throw new Error("参数错误");
	}

	console.time(name);
	const result = await cb();
	console.timeEnd(name);

	return result;
};

// type ChalkColor = "red" | "blue" | "green" | "yellow";
const colors = ['red', 'blue', 'green', 'yellow']
type ChalkColor ="red" | "blue" | "green" | "yellow";

export const logChalk = (color: ChalkColor & any, ...args: any[]) => {
	const isColor = colors.includes(color)
	const remain = isColor ? args : [color, ...args]
	const c = isColor ? color : 'red'
	console.log(chalk[c](...remain));
};
