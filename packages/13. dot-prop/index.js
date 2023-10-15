import { getProperty } from './dot-prop.js'

const obj1 = {
	foo: {
		bar: {
			baz: 1
		},
		fun: ['a', 'b']
	}
}

const r1 =  getProperty(obj1, 'foo.bar.baz')
console.log('r1', r1)
