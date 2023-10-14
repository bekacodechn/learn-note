import { AsyncSeriesWaterfallHook } from 'tapable'

/**
 * AsyncSeriesWaterfallHook 是一个异步串行、瀑布类型的 Hook。如果前一个事件函数的结果 result !== undefined，
 * 则 result 会作为后一个事件函数的第一个参数（也就是上一个函数的执行结果会成为下一个函数的参数）。
*/

const hook = new AsyncSeriesWaterfallHook(["author", "age"]); //先实例化，并定义回调函数的形参
console.time("time");
//异步钩子需要通过tapAsync函数注册事件,同时也会多一个callback参数，执行callback告诉hook该注册事件已经执行完成
hook.tapAsync("测试1", (param1, param2, callback) => {
  console.log("测试1接收的参数：", param1, param2);
  setTimeout(() => {
    callback(null, "2");
  }, 1000);
});

hook.tapAsync("测试2", (param1, param2, callback) => {
  console.log("测试2接收的参数：", param1, param2);
  setTimeout(() => {
    callback(null, "3");
  }, 2000);
});

hook.tapAsync("测试3", (param1, param2, callback) => {
  console.log("测试3接收的参数：", param1, param2);
  setTimeout(() => {
    callback(null, "4");
  }, 3000);
});

hook.callAsync("不要秃头啊", "99", (err, result) => {
  //等全部都完成了才会走到这里来
  console.log("这是成功后的回调", err, result);
  console.timeEnd("time");
});
