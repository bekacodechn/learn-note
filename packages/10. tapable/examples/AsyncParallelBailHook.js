import { AsyncParallelBailHook } from 'tapable'

/**
 * AsyncParallelBailHook 是一个异步并行、保险类型的 Hook，只要其中一个有返回值，就会执行 callAsync 中的回调函数。
 */

const hook = new AsyncParallelBailHook(["author", "age"]); //先实例化，并定义回调函数的形参
console.time("time");
//异步钩子需要通过tapAsync函数注册事件,同时也会多一个callback参数，执行callback告诉hook该注册事件已经执行完成
hook.tapAsync("测试1", (param1, param2, callback) => {
  console.log("测试1接收的参数：", param1, param2);
  setTimeout(() => {
    callback();
  }, 1000);
});

hook.tapAsync("测试2", (param1, param2, callback) => {
  console.log("测试2接收的参数：", param1, param2);
  setTimeout(() => {
    callback(null, "测试2有返回值啦");
  }, 2000);
});

hook.tapAsync("测试3", (param1, param2, callback) => {
  console.log("测试3接收的参数：", param1, param2);
  setTimeout(() => {
    callback(null, "测试3有返回值啦");
  }, 3000);
});

hook.callAsync("不要秃头啊", "99", (err, result) => {
  //等全部都完成了才会走到这里来
  console.log("这是成功后的回调", result);
  console.timeEnd("time");
});
