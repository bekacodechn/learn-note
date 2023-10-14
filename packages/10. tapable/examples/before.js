import { SyncHook } from 'tapable'

/**
 * before 属性的值可以传入一个数组或者字符串,值为注册事件对象时的名称，它可以修改当前事件函数在传入的事件名称对应的函数之前进行执行。
 */

const hook = new SyncHook(['name'])

// hook1在内部会被处理为 { name: 'hook1' }
hook.tap('hook1', (name) => {
	console.log('hook1', name)
})

hook.tap({ name: 'hook2', before: ['hook1'] }, (name) => {
	console.log('hook2', name)
})

hook.call('zs')
