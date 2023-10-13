import { SyncHook, AsyncSeriesHook } from "tapable";
import Compilation from './Compilation.js'
import { createBundleCode } from "./createBundleCode.js";
import fs from 'fs'
import path from 'path'

export default class Compiler {
	constructor(config = {}) {
		const { entry, output, plugins = [], module = {} } = config;
		this._entry = entry;
		this._output = output;
		this._plugins = plugins;
		this._loaders = module.rules || [];
		console.log('this._loaders', this._loaders)

		// 观察者模式，tapable库的tap相当于on，call相当于emit
		this.hooks = {
			run: new SyncHook(["time"]),
			emit: new AsyncSeriesHook(["compiler"]),
		};

		this.initPlugins();
	}

	// 初始化插件，调用插件的apply方法，插件里面是各种hooks.tap，就是订阅消息
	initPlugins() {
		this._plugins.forEach((plugin) => {
			plugin?.apply.call(plugin, this);
		});
	}

	run() {
		console.log('run')
		this.hooks.run.call(Date.now())

		this._compilation = new Compilation({
			entry: this._entry,
			loaders: this._loaders
		})
		this._compilation.make()

		this.hooks.emit.callAsync(this)
		this.emitFiles()
	}

	emitFiles() {
		const modules = this._compilation.graph.reduce((r, m) => {
			r[m.id] = {
				code: m.code,
				mapping: m.mapping
			}
			return r;
		}, {})

		const outputPath = path.join(this._output.path, this._output.filename)
		fs.writeFileSync(outputPath, createBundleCode({ modules }))
	}
}
