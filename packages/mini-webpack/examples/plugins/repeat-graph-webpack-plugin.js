export default class repeatGraphWebpackPlugin {
	apply(compiler) {
		compiler.hooks.emit.tapAsync("emit-plugin", (compiler) => {
			console.log("compilation", compiler._compilation.graph);
			const map = new Map();
			compiler._compilation.graph.forEach((item) => {
				const { id, code } = item;
				const ids = map.get(code) || [];
				if (ids.length > 0) {
					map.set(code, [...ids, id]);
				} else {
					map.set(code, [id]);
				}
			});
			const repeatGraph = [];
			map.forEach((item) => {
				if (item.length > 1) {
					repeatGraph.push(item);
				}
			});

			console.log('以下生成的依赖图ID：',repeatGraph, '将重复')
		});
	}
}
