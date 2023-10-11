import PLimit from "../index";

const fetchSomething = (val, time) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(val);
    }, time)
  );

const limit = PLimit(1);

const input = [
  limit(() => fetchSomething("a", 200)),
  limit(() => fetchSomething("b", 300)),
  limit(() => fetchSomething("c", 400)),
  limit(fetchSomething, "d", 500),
  limit(fetchSomething, "e", 400),
  limit(fetchSomething, "f", 300),
];

console.time("p-limit");

const result = await Promise.all(input);
console.log("result", result);

console.timeEnd("p-limit");
