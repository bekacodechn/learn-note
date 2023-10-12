## 练手项目合集
**package**下为所有练手项目，搭配`examples`示例，可直接运行。

## todo
1. `helper`即其他包使用`esm`
2. `package.json`统一添加测试指令
3. 添加`linter`

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
