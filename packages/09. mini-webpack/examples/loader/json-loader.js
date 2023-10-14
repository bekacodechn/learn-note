export default function parse(source) {
	console.log("需要json-loader处理的信息", source);
	let code = JSON.parse(source);
	code.forEach((item) => (item.age = 18));
	code = JSON.stringify(code);

	const result = `export default ${code}`;
	return result;
}
