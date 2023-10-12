import {name} from './name.js';
import { sum } from './utils/sum.js';

const sumResult =  sum(4, 5)
console.log('sum-message ==>', sumResult)

export default `hello ${name}!`;
