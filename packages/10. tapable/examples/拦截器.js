import { SyncHook } from "tapable";

import { logChalk, logSplit } from "helper";

const logs = logSplit(70)

/**
 * Tapable 提供的所有 Hook 都支持注入 Interception ，它和 Axios 中的拦截器的效果非常类似。
	我们可以通过拦截器对整个 Tapable 发布/订阅流程进行监听，从而触发对应的逻辑。
 */

const hook = new SyncHook(["arg1", "arg2"]);

hook.intercept({
	// 每次调用 hook 实例的 tap() 方法注册回调函数时, 都会调用该方法,
	// 并且接受 tap 作为参数, 还可以对 tap 进行修改;
	register: (tapInfo) => {
		logChalk('regist')
		console.log(`${tapInfo.name} is doing its job`);
		console.log("tapInfo", tapInfo);
		logs();
		return tapInfo; // may return a new tapInfo object
	},
	// 通过hook实例对象上的call方法时候触发拦截器
	call: (arg1, arg2) => {
		logChalk('call')
		console.log("arg1", arg1);
		console.log("arg2", arg2);
		console.log("Starting to calculate routes");
		logs();
	},
	// 在调用被注册的每一个事件函数之前执行
	tap: (tap) => {
		logChalk('tap')
		console.log(tap, "tap");
		logs();
	},
	// loop类型钩子中 每个事件函数被调用前触发该拦截器方法
	loop: (...args) => {
		logChalk('loop')
		console.log(args, "loop");
		logs();
	},
});

hook.tap("监听器1", (name, age) => {
	console.log("监听器1:", name, age);
	logs();
});

hook.tap("监听器2", (name) => {
	console.log("监听器2", name);
	logs();
});

hook.call(10, 20);
