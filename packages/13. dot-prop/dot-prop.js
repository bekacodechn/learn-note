const isObject = value => {
	const type = typeof value;
	return value !== null && (type === 'object' || type === 'function');
};

const isEmptyObject = value => isObject(value) && Object.keys(value).length === 0;

const disallowedKeys = new Set([
	'__proto__',
	'prototype',
	'constructor',
]);

const digits = new Set('0123456789');

function getPathSegments(path) {
	const parts = [];
	let currentSegment = '';
	let currentPart = 'start';
	let isIgnoring = false;

	for (const character of path) {
		switch (character) {
			case '\\': {
				if (currentPart === 'index') {
					throw new Error('Invalid character in an index');
				}

				if (currentPart === 'indexEnd') {
					throw new Error('Invalid character after an index');
				}

				if (isIgnoring) {
					currentSegment += character;
				}

				currentPart = 'property';
				isIgnoring = !isIgnoring;
				break;
			}

			case '.': {
				if (currentPart === 'index') {
					throw new Error('Invalid character in an index');
				}

				if (currentPart === 'indexEnd') {
					currentPart = 'property';
					break;
				}

				if (isIgnoring) {
					isIgnoring = false;
					currentSegment += character;
					break;
				}

				if (disallowedKeys.has(currentSegment)) {
					return [];
				}

				parts.push(currentSegment);
				currentSegment = '';
				currentPart = 'property';
				break;
			}

			case '[': {
				if (currentPart === 'index') {
					throw new Error('Invalid character in an index');
				}

				if (currentPart === 'indexEnd') {
					currentPart = 'index';
					break;
				}

				if (isIgnoring) {
					isIgnoring = false;
					currentSegment += character;
					break;
				}

				if (currentPart === 'property') {
					if (disallowedKeys.has(currentSegment)) {
						return [];
					}

					parts.push(currentSegment);
					currentSegment = '';
				}

				currentPart = 'index';
				break;
			}

			case ']': {
				if (currentPart === 'index') {
					parts.push(Number.parseInt(currentSegment, 10));
					currentSegment = '';
					currentPart = 'indexEnd';
					break;
				}

				if (currentPart === 'indexEnd') {
					throw new Error('Invalid character after an index');
				}

				// 跌倒
			}

			default: {
				if (currentPart === 'index' && !digits.has(character)) {
					throw new Error('Invalid character in an index');
				}

				if (currentPart === 'indexEnd') {
					throw new Error('Invalid character after an index');
				}

				if (currentPart === 'start') {
					currentPart = 'property';
				}

				if (isIgnoring) {
					isIgnoring = false;
					currentSegment += '\\';
				}

				currentSegment += character;
			}
		}
	}

	if (isIgnoring) {
		currentSegment += '\\';
	}

	switch (currentPart) {
		case 'property': {
			if (disallowedKeys.has(currentSegment)) {
				return [];
			}

			parts.push(currentSegment);

			break;
		}

		case 'index': {
			throw new Error('Index was not closed');
		}

		case 'start': {
			parts.push('');

			break;
		}
		// 无默认值
	}

	return parts;
}

function isStringIndex(object, key) {
	if (typeof key !== 'number' && Array.isArray(object)) {
		const index = Number.parseInt(key, 10);
		return Number.isInteger(index) && object[index] === object[key];
	}

	return false;
}

function assertNotStringIndex(object, key) {
	if (isStringIndex(object, key)) {
		throw new Error('Cannot use string index');
	}
}

export function getProperty(object, path, value) {
	if (!isObject(object) || typeof path !== 'string') {
		return value === undefined ? object : value;
	}

	const pathArray = getPathSegments(path);
	console.log('pathArray', pathArray)
	if (pathArray.length === 0) {
		return value;
	}

	for (let index = 0; index < pathArray.length; index++) {
		const key = pathArray[index];

		if (isStringIndex(object, key)) {
			object = index === pathArray.length - 1 ? undefined : null;
		} else {
			object = object[key];
		}

		if (object === undefined || object === null) {
			// “object”要么是“undefined”，要么是“null”，所以我们想停止循环，并且
// 如果这不是路径的最后一点，并且
// 如果它没有返回“未定义”
// 如果“object”是“null”，它将返回“null”
// 但我们希望 `get({foo: null}, 'foo.bar')` 等于 `undefined` 或提供的值，而不是 `null`
			if (index !== pathArray.length - 1) {
				return value;
			}

			break;
		}
	}

	return object === undefined ? value : object;
}

export function setProperty(object, path, value) {
	if (!isObject(object) || typeof path !== 'string') {
		return object;
	}

	const root = object;
	const pathArray = getPathSegments(path);

	for (let index = 0; index < pathArray.length; index++) {
		const key = pathArray[index];

		assertNotStringIndex(object, key);

		if (index === pathArray.length - 1) {
			object[key] = value;
		} else if (!isObject(object[key])) {
			object[key] = typeof pathArray[index + 1] === 'number' ? [] : {};
		}

		object = object[key];
	}

	return root;
}

export function deleteProperty(object, path) {
	if (!isObject(object) || typeof path !== 'string') {
		return false;
	}

	const pathArray = getPathSegments(path);

	for (let index = 0; index < pathArray.length; index++) {
		const key = pathArray[index];

		assertNotStringIndex(object, key);

		if (index === pathArray.length - 1) {
			delete object[key];
			return true;
		}

		object = object[key];

		if (!isObject(object)) {
			return false;
		}
	}
}

export function hasProperty(object, path) {
	if (!isObject(object) || typeof path !== 'string') {
		return false;
	}

	const pathArray = getPathSegments(path);
	if (pathArray.length === 0) {
		return false;
	}

	for (const key of pathArray) {
		if (!isObject(object) || !(key in object) || isStringIndex(object, key)) {
			return false;
		}

		object = object[key];
	}

	return true;
}

// TODO：不应该转义没有效果的反斜杠
export function escapePath(path) {
	if (typeof path !== 'string') {
		throw new TypeError('Expected a string');
	}

	return path.replace(/[\\.[]/g, '\\$&');
}

// Object.entries() 对于数组返回的键是字符串
function entries(value) {
	const result = Object.entries(value);
	if (Array.isArray(value)) {
		return result.map(([key, value]) => [Number(key), value]);
	}

	return result;
}

function stringifyPath(pathSegments) {
	let result = '';

	for (let [index, segment] of entries(pathSegments)) {
		if (typeof segment === 'number') {
			result += `[${segment}]`;
		} else {
			segment = escapePath(segment);
			result += index === 0 ? segment : `.${segment}`;
		}
	}

	return result;
}

function * deepKeysIterator(object, currentPath = []) {
	if (!isObject(object) || isEmptyObject(object)) {
		if (currentPath.length > 0) {
			yield stringifyPath(currentPath);
		}

		return;
	}

	for (const [key, value] of entries(object)) {
		yield * deepKeysIterator(value, [...currentPath, key]);
	}
}

export function deepKeys(object) {
	return [...deepKeysIterator(object)];
}
