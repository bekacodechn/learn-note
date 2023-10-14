import { HookMap, SyncHook } from 'tapable';

/**
 * HookMap 本质上就是一个辅助类，通过 HookMap 我们可以更好的管理 Hook
 */

// 创建HookMap实例
const keyedHook = new HookMap((key) => new SyncHook(['arg']));

// 在keyedHook中创建一个name为key1的hook，同时为该hook通过tap注册事件
keyedHook.for('key1').tap('Plugin 1', (arg) => {
  console.log('Plugin 1', arg);
});

// 在keyedHook中创建一个name为key2的hook，同时为该hook通过tap注册事件
keyedHook.for('key2').tap('Plugin 2', (arg) => {
  console.log('Plugin 2', arg);
});

keyedHook.for('key2').tap('Plugin 2.2', (arg) => {
  console.log('Plugin 2.2', arg);
});

// 在keyedHook中创建一个name为key1的hook，同时为该hook通过tap注册事件
keyedHook.for('key3').tap('Plugin 3', (arg) => {
  console.log('Plugin 3', arg);
});

// 从HookMap中拿到name为key1的hook
const hook = keyedHook.get('key2');

if (hook) {
  // 通过call方法触发Hook
  hook.call('hello');
}
