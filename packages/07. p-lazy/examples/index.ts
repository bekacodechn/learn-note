import PLazy from "../index";
import { logTime, delay } from "helper";

const promise = new PLazy((resolve) => {
	setTimeout(() => {
		resolve(10);
	}, 2000);
});

logTime(async () => {
	await delay(2000);
	const result = await promise;
	// new PLazy后输入result需要4s，说明调用then之后真正执行了new PLazy内部的逻辑
	// 如果换成 new Promise，结果将是2s.
	console.log("result", result);
});
