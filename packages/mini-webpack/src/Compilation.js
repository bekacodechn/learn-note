import fs from "fs";
import { parse } from "./parser.js";
import path from "path";

let ID = 0;

export default class Compilation {
	constructor({ entry, loaders }) {
		this._entry = entry;
		this._loaders = loaders;
		this.graph = [];
	}

	// 每个文件就是一个module，处理module获取必要信息
	bundleModule(filename) {
		let content = fs.readFileSync(filename, { encoding: "utf-8" });

		// 处理loader
		this._loaders.forEach((rule) => {
			const { test, loader } = rule;
			if (test.test(filename)) {
				content = loader(content);
			}
		});

		const { code, dependencies } = parse(content);

		return {
			filename, // 当前处理的文件名
			dependencies, // 当前文件中存在的依赖项
			code, // 降级后的代码
			mapping: {}, // 以依赖项路径为key, id为值生成对应关系
			id: ID++, // 唯一ID
		};
	}

	// 构建依赖图
	make() {
		const moduleQueue = [];

		const entryModule = this.bundleModule(this._entry);
		moduleQueue.push(entryModule);
		this.graph.push(entryModule);

		for (const currentModule of moduleQueue) {
			currentModule.dependencies.forEach((dependency) => {
				// 拼接依赖项的绝对路径
				const dirname = path.dirname(currentModule.filename);
				const childPath = path.resolve(dirname, dependency);

				const childModule = this.bundleModule(childPath);
				currentModule.mapping[dependency] = childModule.id;
				moduleQueue.push(childModule);
				this.graph.push(childModule);
			});
		}
	}
}
