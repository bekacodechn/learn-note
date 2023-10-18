/**
 * glob转regexp
 */
module.exports = function globToRegexp(glob, options) {
	if (typeof glob !== "string") {
		throw new TypeError("请传入字符串");
	}

	let reg = "";
	// 默认情况: *.min.js 转换为 /^.*\.min\.js$/
	let { extended, globstar, flags } = options || {};
	// extended为true: ? 转 .   [a-z]表示范围   {*.html,*.js} 转 (.*html|.*js)
	extended = Boolean(extended);
	// globstar为true: /foo/** 将匹配已/foo/开头的任何内容；/foo/**/*.js将匹配 /foo/开头和.js结尾的内容；如果为false，则将多个*看做一个
	globstar = Boolean(globstar);
	flags = typeof flags === "string" ? flags : "";

	// 在extended为true时，在{}内为true
	let inGroup = false;

	for (let i = 0, len = glob.length; i < len; i++) {
		const c = glob[i];

		switch (c) {
			case "/":
			case "$":
			case "^":
			case "+":
			case ".":
			case "(":
			case ")":
			case "=":
			case "!":
			case "|":
				// 转义没有用到的特殊字符
				reg += "\\" + c;
				break;
			case "?":
				if (extended) {
					reg += ".";
					// 如果extended为false，则还需要加\，所以break在if内部
					break;
				}
			case "[":
				if (extended) {
					reg += c;
					// 如果extended为false，则还需要加\，所以break在if内部
					break;
				}
			case "]":
				if (extended) {
					reg += c;
					// 如果extended为false，则还需要加\，所以break在if内部
					break;
				}
			case "{":
				if (extended) {
					inGroup = true;
					reg += "(";
					// 如果extended为false，则还需要加\，所以break在if内部
					break;
				}
			case "}":
				if (extended) {
					inGroup = false;
					reg += ")";
					// 如果extended为false，则还需要加\，所以break在if内部
					break;
				}
			case ",":
				if (inGroup) {
					reg += "|";
					// 如果extended为false，则还需要加\，所以break在if内部
					break;
				}
				reg += "\\" + c;
				break;
			case "*":
				const prevChar = glob[i - 1];
				let starCount = 1;
				while (glob[i + 1] === "*") {
					starCount++;
					i++;
				}
				const nextChar = glob[i + 1];

				if (!globstar) {
					reg += ".*";
				} else {
					// globstar 已启用，因此判断这是否是 globstar 段
					const isGlobStar =
						starCount > 1 &&
						(prevChar === "/" || prevChar === undefined) && // 从片段的开头
						(nextChar === "/" || nextChar === undefined); // 到该段的末尾

					if (isGlobStar) {
						// 它是一个 globstar，所以匹配零个或多个路径段
						reg += "((?:[^/]*(?:/|$))*)";
						i++;
					} else {
						// 它不是 globstar，因此仅匹配一个路径段
						reg += "([^/]*)";
					}
				}
				break;
			default:
				reg += c;
		}
	}

	// 当正则表达式“g”标志被指定时，不要 使用 ^ & $ 约束正则表达式
	if (!flags || !~flags.indexOf("g")) {
		reg = `^${reg}$`;
	}

	return new RegExp(reg, flags);
};
