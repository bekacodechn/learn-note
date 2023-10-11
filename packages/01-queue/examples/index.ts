import Queue from '../index'

const q = new Queue()

q.enqueue(1)
q.enqueue(2)
q.enqueue(3)
q.enqueue(4)

console.log('q.size', q.size)

const arr = [...q]
console.log('arr', arr)