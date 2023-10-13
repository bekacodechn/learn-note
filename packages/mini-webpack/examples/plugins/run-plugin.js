export default class RunPlugin {
	apply(compiler) {
		compiler.hooks.run.tap("run-plugin", (time) => {
			console.log("开始编译时间", new Date(time).toLocaleTimeString());
		});
	}
}
