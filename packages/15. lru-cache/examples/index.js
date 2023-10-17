import LRUCache from '../index.js'

const onEviction = (val) => {
	console.log('已被驱逐: ', val)
}

const cache = new LRUCache({
	maxSize: 3,
	onEviction
})

cache.set('a', 1)
cache.set('b', 2)
cache.set('c', 3)
cache.set('d', 4)

const size = cache.size
console.log('size', size)


const c = cache.get('c')
console.log('c', c)
cache.set('e', 5)
cache.set('f', 6)
cache.set('g', 7)
const c2 = cache.get('c')
console.log('c2', c2)
const evictionCount = cache.evictionCount
console.log('evictionCount', evictionCount)

const nextKey = cache.keys().next().value
console.log('nextKey', nextKey)
const keys = cache.keys()
console.log('keys', Array.from(keys))

const values = cache.values()
console.log('values', [...values])

cache.delete('e')

cache.forEach((value, key) => {
	console.log(`key: ${key}; value: ${value}`);
})

cache.clear()

console.log('cache.size', cache.size)
