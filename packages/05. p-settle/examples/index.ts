import settle from "../index.js";
import delay from "delay";
import { logTime } from "helper";
const a = 1;
const b = () => 2;
const c = () => delay(1000, { value: 3 });
const d = () => new Promise((_, reject) => setTimeout(reject, 2000));

logTime(async () => {
  const arr = [a, b, c, d];
  const result = await settle(arr, { concurrency: 2 });
  console.log("result", result);
});
