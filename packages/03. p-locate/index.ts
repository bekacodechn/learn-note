import PLimit from "p-limit";

class EndError extends Error {
  constructor(public value) {
    super();
    this.value = value;
  }
}

const testElement = async (element, tester) => tester(await element);

const finder = async (element) => {
  // 处理可能得Promise
  const values = await Promise.all(element);
  // 技巧：抛出自定义错误打断map循环
  if (values[1] === true) {
    throw new EndError(values[0]);
  }
  return false;
};

export default async function pLocate(
  iterable,
  tester,
  { concurrency = Number.POSITIVE_INFINITY, preserveOrder = true } = {}
) {
  const limit = PLimit(concurrency);
  // 获得全部iterable对应的结果：[element, terser(element)]
  const items = [...iterable].map((element) => [
    element,
    limit(testElement, element, tester), // limit返回promise
  ]);

  // 按iterator顺序找则不并发
  const checkLimit = PLimit(preserveOrder ? 1 : Number.POSITIVE_INFINITY);

  try {
    await Promise.all(items.map((element) => checkLimit(finder, element)));
  } catch (error) {
    // 如果为自定义错误，返回找到的结果
    if (error instanceof EndError) {
      return error.value;
    }

    throw error;
  }
}
