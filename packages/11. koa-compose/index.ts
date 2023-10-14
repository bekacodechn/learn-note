import { delay } from "helper";

const middlewares = [];

const app = {
	use(cb: Function) {
		middlewares.push(cb);
	},
};

app.use(async (context, next) => {
	console.log(1);
	await delay(500)
	await next();
	await delay(500)
	console.log(2);
});
app.use(async (context, next) => {
	console.log(3);
	await delay(500)
	await next();
	await delay(500)
	console.log(4);
});
app.use(async (context, next) => {
	console.log(5);
	await delay(500)
	await next();
	await delay(500)
	console.log(6);
});

const compose = (middlewares) => {
	// 判断是否为数组，判断数组元素是否均为函数
	// ...

	return function (context, next) {
		let index = -1;

		return dispatch(0);
		function dispatch(i) {
			// 判断next是否重复调用，如果重复调用，会命中 i === index 从而报错
			if (i <= index) throw Promise.reject(new Error("next() 不能调用多次"));
			index = i;

			let fn = middlewares[i];
			if (i === middlewares.length) fn = next;
			if (typeof fn !== "function") return Promise.resolve();

			try {
				return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
			} catch (err) {
				return Promise.reject(err);
			}
		}
	};
};

const run = compose(middlewares);
const ctx = { name: "koa-compose" };
run(ctx, async (context, next) => {
	console.log(7);
	await delay(500)
	await next();
	await delay(500)
	console.log(8);
}).then((res) => {
	console.log("res", res);
});
