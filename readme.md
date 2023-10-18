## 练手项目合集
**package**下为所有练手项目，搭配`examples`示例，可直接运行。

## todo
1. 所有包统一使用`esm`
2. 每个包的`package.json`添加测试指令
3. 添加`linter`
4. 文章分类

### 1. queue
先进先出单项链表，支持压栈、出栈、迭代和获取长度。

原项目：[yocto-queue](https://github.com/sindresorhus/yocto-queue)。

## 2. p-limit
控制并发，在原基础上添加了取消未完成任务`clearPending()`。

原项目： [ p-limit ](https://github.com/sindresorhus/p-limit)

## 3. p-locate
异步版的`Array#find`。

原项目：[ p-locate ](https://github.com/sindresorhus/p-locate)

## 4. delay
延迟函数，支持打断、提前开始。

原项目：[delay](https://github.com/sindresorhus/delay)

## 5. p-settle
类似`Promise.allSettled`，但支持控制并发。

原项目: [p-settle](https://github.com/sindresorhus/p-settle/tree/main)

## 6. p-defer
deferred promise. 将`promise`、`resolve`、`reject`挂在同一个对象并返回。

原项目: [p-defer](https://github.com/sindresorhus/p-defer)

## 7. p-lazy
延迟执行`Promise`构造体。在调用`then`时才执行`new PLazy(executor)`里的`executor`。

原项目：[p-lazy](https://github.com/sindresorhus/p-lazy)

## 8. minipack
用javascript编写的现代模块打包器的简化示例，学习自 minipack-explain。

小优化：在构建依赖图时避免了重复收集依赖。

原项目：[minipack-explain](https://github.com/chinanf-boy/minipack-explain/tree/master) 有更详细的注释

## 9. mini-webpack
1. 相比`minipack`多实现了`loader`和`plugin`，构建依赖等核心代码基本相同。
2. `loader`的调用发生在将`module`转为`ast`之前，是`source => source`的过程（均为字符串）。
3. `plugin`的机制本质上是观察者模式，每个`plugin`都是一个类，并提供`apply`方法，插件开发者在这个方法内订阅若干事件（声明周期）。在`webpack`初始化`compiler`后立即遍历
`plugins`并调用`apply`。用到了`tapable`库，该库提供插件的多种运行模式。

原项目：[mini-webpack](https://github.com/cuixiaorui/mini-webpack)

## 10. tapable
`webpack`使用的插件管理机制。 在`examples`提供了各种`hook`的运行示例。`tapable`里的各种`tap`是通过`new Function`形式动态生成的，看一下就行，平常写代码不会这样写。

原项目: [tapable](https://github.com/webpack/tapable)

参考文章：[【中级/高级前端】为什么我建议你一定要读一读 Tapable 源码？](https://juejin.cn/post/7164175171358556173)

## 11. koa-compose
`koa`洋葱模型。

原项目: [koa-compose](https://www.npmjs.com/package/koa-compose)

## 12. interesting-program
收集有趣的代码片段/功能

## 13. dot-prop
todo.

## 14. webpack
持续更新

## 15. lru-cache
模仿`quick-lru`写的简单`lru`工具，去除了`双map`、`maxAge`。`双map`方案借鉴了[hashlru](https://github.com/dominictarr/hashlru#algorithm)，是为了解决`delete obj[prop]`慢的问题。

原项目: [quick-lru](https://github.com/sindresorhus/quick-lru#readme)

## 16. glob-to-regexp
简版`glob`。 将`*`等通配符转为正则表达式，识别`*`、`?`、`{}`和`[]`，代码100来行，但很精彩。
1. `for`循环 + `switch` + `while`循环逐字解析字符串，并转为正则字符串。
2. `switch`里的`break`放在`if`里,不符合要求时穿透下面的`case`，在最后的`case`里统一处理之前的内容。
3. 可以作为学习`dot-prop`铺垫。

原项目: [glob-to-regexp](https://github.com/fitzgen/glob-to-regexp/tree/master)
