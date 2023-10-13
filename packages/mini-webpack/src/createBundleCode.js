import fs from "fs";
import { dirname } from "./util.js";
import path from "path";
import ejs from "ejs";

export function createBundleCode({ modules }) {
	const template = fs.readFileSync(path.resolve(dirname(), "bundle.ejs"), {
		encoding: "utf-8",
	});

	const code = ejs.render(template, { modules });
	return code;
}
