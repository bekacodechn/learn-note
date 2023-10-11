import pLocate from "..";
import { delay, logTime } from "helper";

const values = [1, Promise.resolve(2), delay(2000, 3), 4];

const test = (value) => {
  if (value === 4 ) {
    return true;
  }
};

logTime(async () => {
  const result = await pLocate(values, test);
  console.log("result", result);
});
