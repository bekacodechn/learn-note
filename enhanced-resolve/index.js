// import resolve from 'enhanced-resolve'
// import path from 'path'

// // const r =  resolve('p-limit', (...args) => {
// // 	console.log('args', args)
// // })

// const r = path.resolve('p-limit')
// console.log('r', r)

const r = require.resolve('p-limit')
console.log('r', r)
