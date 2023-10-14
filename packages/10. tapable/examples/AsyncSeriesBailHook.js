import { AsyncSeriesBailHook } from "tapable";

/**
 * AsyncSeriesBailHook 是一个异步串行、保险类型的 Hook。在串行的执行过程中，只要其中一个有返回值，后面的就不会执行了。
 */

const hook = new AsyncSeriesBailHook(["author", "age"]); //先实例化，并定义回调函数的形参
console.time("time");

// tapPromise注册的也可以用callAsync调用
hook.tapPromise("测试1", (param1, param2, callback) => {
  console.log("测试1接收的参数：", param1, param2);
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			// 在 tapPromise 中callback是undefined
			// 如果reject(1)，callAsync的回调函数中的err将会是此值
			resolve(1)
		}, 1000)
	 })
});

hook.tapAsync("测试2", (param1, param2, callback) => {
	console.log("测试2接收的参数：", param1, param2);
	setTimeout(() => {
		callback(null, "123");
	}, 2000);
});

hook.tapAsync("测试3", (param1, param2, callback) => {
	console.log("测试3接收的参数：", param1, param2);
	setTimeout(() => {
		callback();
	}, 3000);
});

hook.callAsync("不要秃头啊", "99", (err, result) => {
	//等全部都完成了才会走到这里来
	console.log('err', err)
	console.log("这是成功后的回调", result);
	console.timeEnd("time");
});
