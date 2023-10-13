import { name } from "./name.js";
import { sum } from "./utils/sum.js";
import userInfo from "./userInfo.json";

const sumResult = sum(4, 5);
console.log("sum-message ==>", sumResult);

console.log("loader为每个用户添加了age信息", userInfo);

export default `hello ${name}!`;
