export default class LRUCache {
	#maxSize;
	#onEviction;
	#map = new Map();
	#evictionCount = 0;
	constructor(options) {
		const { maxSize, onEviction } = options || {};

		if (typeof maxSize !== "number" || maxSize <= 0) {
			throw new TypeError("`maxSize`必须为正整数");
		}

		if (onEviction && typeof onEviction !== "function") {
			throw new TypeError("`onEviction`必须为函数");
		}

		this.#maxSize = maxSize;
		this.#onEviction = onEviction;
		this.#delegateMethods();
	}

	#delegateMethods() {
		[
			"has",
			"delete",
			"clear",
			"keys",
			"values",
			"entries",
			"valueOf",
			"forEach",
		].forEach((method) => {
			this[method] = function () {
				return this.#map[method].apply(this.#map, arguments);
			};
		});
	}

	get size() {
		return this.#map.size;
	}

	get maxSize() {
		return this.#maxSize;
	}

	#emitEviction(value) {
		if (typeof this.#onEviction === "function") {
			this.#onEviction(value);
		}
	}

	set(key, value) {
		if (this.has(key)) {
			this.delete(key);
		}

		this.#map.set(key, value);

		if (this.#map.size > this.#maxSize) {
			const oldKey = this.#map.keys().next().value;
			const oldValue = this.#map.get(oldKey);
			this.delete(oldKey);
			this.#evictionCount++;
			this.#emitEviction({ key: oldKey, value: oldValue });
		}
	}

	get(key) {
		if (!this.has(key)) {
			return;
		}

		const value = this.#map.get(key);

		this.delete(key);
		this.#map.set(key, value);

		return value;
	}

	peek(key) {
		return this.#map.get(key);
	}

	get [Symbol.toStringTag]() {
		return "LRUCache";
	}

	get evictionCount() {
		return this.#evictionCount;
	}
}
