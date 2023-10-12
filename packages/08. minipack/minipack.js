//
// 模块捆绑器 将 小块代码 编译成 更大和更复杂的代码,可以运行在Web浏览器中.

// 这些小块只是JavaScript文件以及它们之间的依赖关系,而这正是由模块系统表示
// https://webpack.js.org/concepts/modules

// 模块捆绑器具有 入口文件 的概念,而不是添加一些脚本标签在浏览器中并让它们运行,我们让 捆绑器 知道
// 哪个文件是我们应用程序的主要文件.该文件能引导我们的整个应用程序.

// 我们的打包程序将从该入口文件开始,并尝试理解它依赖于哪些文件. 然后,它会尝试了解哪些文件
// 依赖关系取决于它,它会继续这样做,直到它发现我们应用程序中的 每个模块,以及它们如何 相互依赖.
// 这种对项目的理解被称为`依赖图`.

// 在这个例子中,我们将创建一个 依赖关系图 并将其用于打包
// 它的所有模块都捆绑在一起.

// 让我们开始 : )

// >请注意: 这是一个非常简化的例子
// 对这些例子仅仅执行一次循环依赖,缓存模块导出和解析每个模块
// 其他方面的处理都跳过,使这个例子尽可能简单.
const path = require("path");
const fs = require("fs");
const { parse, traverse, transformFromAst } = require("@babel/core");

let ID = 0;
const imported = new Map();

/**
 *
 * @param {string} filename 入口路径
 * @returns { id: number, code: string, filename: string, dependencies: string[], loaded: boolean }
 * id: 模块ID、 code: 模块源码、 filename: 文件名、 dependencies: 当前模块的依赖、 loaded: 否加载过当前模块
 */
function createAsset(filename) {
	// 加载过此文件则直接返回，可以防止ID变化
	if (imported.has(filename)) {
		return imported.get(filename);
	}
	const content = fs.readFileSync(filename, "utf-8");

	const ast = parse(content, { sourceType: "module" });

	const dependencies = [];

	traverse(ast, {
		ImportDeclaration({ node }) {
			const source = node.source.value;
			dependencies.push(source);
		},
	});

	const id = ID++;

	// 转为babel预设的ES5
	const { code } = transformFromAst(ast, content, {
		presets: ["@babel/preset-env"],
	});

	const asset = {
		id,
		code,
		filename,
		dependencies,
		loaded: false,
	};
	imported.set(filename, asset);
	return asset;
}

function createGraph(filename) {
	const entryAsset = createAsset(filename);

	entryAsset.loaded = true;
	// 下面两行的做法很巧妙，可以达到递归构建依赖图的作用
	const queue = [entryAsset];
	for (const asset of queue) {
		asset.mapping = {};

		const { filename, dependencies } = asset;
		const dirname = path.dirname(filename);

		dependencies.forEach((relativePath) => {
			const absolutePath = path.join(dirname, relativePath);
			const child = createAsset(absolutePath);
			const { id, loaded } = child;

			// { [path: string]: number } 记录依赖和依赖ID
			asset.mapping[relativePath] = id;

			if (!loaded) {
				// 标记加载过此文件
				child.loaded = true;
				queue.push(child);
			}
		});
	}

	return queue;
}

// 拼接bundle的代码(字符串)
function bundle(graph) {
	let modules = "";

	graph.forEach((mod) => {
		const { id, code, mapping } = mod;
		//  图表中的每个模块在这个对象中都有一个`entry`. 我们使用`模块的id`作为`key`和一个数组作为`value` (用数组因为我们在每个模块中有2个值) .

		// 第一个值是用函数包装的每个模块的代码. 这是因为模块应该被 限定范围: 在一个模块中定义变量不会影响 其他模块 或 全局范围.

		// 我们的模块在我们将它们`转换{被 babel 转译}`后, 使用`commonjs`模块系统: 他们期望一个`require`, 一个`module`和`exports`对象可用. 那些在浏览器中通常不可用,所以我们将它们实现并将它们注入到函数包装中.

		// 对于第二个值,我们用`stringify`解析模块及其依赖之间的关系(也就是上文的asset.mapping). 解析后的对象看起来像这样: `{'./relative/path': 1}`.

		// 这是因为我们模块的被转换后会通过相对路径来调用`require()`. 当调用这个函数时,我们应该能够知道依赖图中的哪个模块对应于该模块的相对路径.
		modules += `${id}: [
      function (require, module, exports) { ${code} },
      ${JSON.stringify(mapping)}
    ],`;
	});

	//   最后,我们实现自调函数的主体.

	//   我们首先创建一个`require()`⏰函数: 它接受一个 `模块ID` 并在我们之前构建的`模块`对象查找它.

	//   通过解构`const [fn, mapping] = modules[id]`来获得我们的包装函数 和`mappings`对象.

	//   我们模块的代码通过相对路径而不是模块ID调用`require()`.

	// 但我们的`require`🌟函数接收 `模块ID`. 另外,两个模块可能`require()`相同的相对路径,但意味着两个不同的模块.

	//     要处理这个问题,当需要一个模块时,我们创建一个新的,专用的`require`函数供它使用.

	// 它将是特定的,并将知道通过使用`模块的mapping对象`将 `其相对路径` 转换为`ID`.

	// 该mapping对象恰好是该特定模块的`相对路径和模块ID`之间的映射.

	// 最后,使用`commonjs`,当模块需要被导出时,它可以通过改变exports对象来暴露模块的值.
	// require函数最后会返回exports对象.
	const result = `
    (function(modules) {
      function require(id) {
        const [ fn, mapping ] = modules[id]

        function localRequire(name) {
          return require(mapping[name])
        }

        const module = { exports: {} }

        fn(localRequire, module, module.exports)

        return module.exports
      };
      require(0);
    })({ ${modules} })
  `;

	return result;
}

const graph = createGraph("./example/entry.js");
console.log("graph", graph);
const result = bundle(graph);

const dist = path.resolve(process.cwd(), "./dist");
fs.existsSync(dist) && fs.rmSync(dist, { recursive: true });
fs.mkdirSync(dist);
fs.writeFileSync(path.resolve(dist, "./bundle.js"), result);
