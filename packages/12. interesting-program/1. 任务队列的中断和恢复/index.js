/**
 * url: https://www.bilibili.com/video/BV1ih4y1m74W
 *
 * 依次顺序执行一系列任务
 * 所有任务全部完成后可以得到每个任务的执行结果
 * 需要返回两个方法，start用于启动任务，pause用于暂停任务
 * 每个任务具有原子性，即不可中断，只能在两个任务之间中断
 * @param {..Function} tasks 任务列表，每个任务无参、异步
 */

const delay = (time, value) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(value);
		}, time);
	});
};

const gen = function* (count) {
	let i = 0;
	while (i++ < count) {
		const time = Math.floor(Math.random() * 10 + 1) * 100;
		yield () => delay(time, time);
	}
};

const tasks = [...gen(10)];

function processTask(tasks) {
	let isRunning = false;
	const result = [];
	let index = 0;
	return {
		start() {
			return new Promise(async (resolve) => {
				if (isRunning) {
					return;
				}
				isRunning = true;

				while (index < tasks.length) {
					console.log("任务开始", index);
					const r = await tasks[index]();
					console.log("任务结束", index);
					result.push(r);

					index++;

					if (!isRunning) {
						return; // 如果换成break，因为会跳出while循环，每次暂停时start方法都会得到结果，不符合要求
					}
				}

				isRunning = false;
				resolve(result);
			});
		},
		pause() {
			isRunning = false;
		},
	};
}

const { start, pause } = processTask(tasks);

document.querySelector("#start").addEventListener("click", async () => {
	console.time("耗时");
	const result = await start();
	console.log("result", result);
	console.timeEnd("耗时");
});
document.querySelector("#pause").onclick = pause;
