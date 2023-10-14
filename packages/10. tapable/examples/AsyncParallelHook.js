import { AsyncParallelHook } from 'tapable'

/**
 * 前面四个都是同步的 Hook，接下来开始看看异步的 Hook。

AsyncParallelHook是一个异步并行、基本类型的 Hook，它与同步 Hook 不同的地方在于：

它会同时开启多个异步任务，而且需要通过 tapAsync 方法来注册事件（同步 Hook 是通过 tap 方法）
在执行注册事件时需要使用 callAsync 方法来触发（同步 Hook 使用的是 call 方法）
同时，在每个注册函数的回调中，会多一个 callback 参数，它是一个函数。执行 callback 函数相当于告诉 Hook 它这一个异步任务执行完成了。
*/

const hook = new AsyncParallelHook(["author", "age"]); //先实例化，并定义回调函数的形参
console.time("time");
//异步钩子需要通过tapAsync函数注册事件,同时也会多一个callback参数，执行callback告诉hook该注册事件已经执行完成
hook.tapAsync("测试1", (param1, param2, callback) => {
  setTimeout(() => {
    console.log("测试1接收的参数：", param1, param2);
    callback();
  }, 2000);
});

hook.tapAsync("测试2", (param1, param2, callback) => {
  console.log("测试2接收的参数：", param1, param2);
  callback();
});

hook.tapAsync("测试3", (param1, param2, callback) => {
  console.log("测试3接收的参数：", param1, param2);
  callback();
});

//call方法只有同步钩子才有，异步钩子得使用callAsync
hook.callAsync("不要秃头啊", "99", (err, result) => {
  //等全部都完成了才会走到这里来
  console.log("这是成功后的回调", err, result);
  console.timeEnd("time");
});
