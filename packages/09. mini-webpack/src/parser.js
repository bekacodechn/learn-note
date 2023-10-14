import {
	parse as babelParse,
	traverse,
	transformFromAstSync,
} from "@babel/core";

export function parse(content) {
	const dependencies = [];

	// 代码转ast
	const ast = babelParse(content, {
		sourceType: "module",
	});

	// 遍历ast，收集import源路径
	traverse(ast, {
		ImportDeclaration({ node }) {
			dependencies.push(node.source.value);
		},
	});

	// 语法降级
	const { code } = transformFromAstSync(ast, content, {
		presets: ["@babel/preset-env"],
	});

	return { code, dependencies };
}
