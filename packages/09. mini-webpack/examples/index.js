import { webpack } from "../src/index.js";
import Url from "url";
import path from "path";
import jsonLoader from "./loader/json-loader.js";
import RunPlugin from './plugins/run-plugin.js'
import repeatGraphWebpackPlugin from './plugins/repeat-graph-webpack-plugin.js'

const __dirname = path.dirname(Url.fileURLToPath(import.meta.url));

const config = {
	entry: path.resolve(__dirname, "./application/entry.js"),
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.json$/,
				loader: jsonLoader,
			},
		],
	},
	plugins: [
		new RunPlugin(),
		new repeatGraphWebpackPlugin()
	]
};

webpack(config);
