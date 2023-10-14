import { SyncHook } from 'tapable'

/**
 * stage 这个属性的类型是数字，数字越大事件回调执行的越晚，支持传入负数，不传时默认为0.
 * 如果同时使用 before 和 stage 时，优先会处理 before ，在满足 before 的条件之后才会进行 stage 的判断。
 *
 * 待确认： 以下示例还是hook2先执行
 */

const hook = new SyncHook(['name'])

hook.tap({ name: 'hook1', stage: 1}, (name) => {
	console.log('hook1', name)
})

hook.tap({ name: 'hook2', stage: 2 }, (name) => {
	console.log('hook2', name)
})

hook.call('zs')
