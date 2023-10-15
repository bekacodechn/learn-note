代码如下:

`src/index.js`:
```js
import { log } from './util/log'

log(10)
```

`src/util/log.js`:
```js
export const log = (...args) => {
  console.log(...args)
}
```

webpack配置如下:

```js
module.exports = {
  mode: "development",
  entry: "./src/index.js"
};
```

打包结果如下：

```js
(() => {
  // webpack引导程序
  "use strict";
  var __webpack_modules__ = {
    "./src/index.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      __webpack_require__.r(__webpack_exports__);
      var _util_log__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__("./src/util/log.js");
      (0, _util_log__WEBPACK_IMPORTED_MODULE_0__.log)(10);
      //# sourceURL=webpack://l-webpack/./src/index.js?
    },

    "./src/util/log.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, { log: () => log });
      const log = (...args) => {
        console.log(...args);
      };
      //# sourceURL=webpack://l-webpack/./src/util/log.js?
    },
  };
  var __webpack_module_cache__ = {};

  function __webpack_require__(moduleId) {
    // 检查模块是否在缓存中
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    // 创建一个新模块（并将其放入缓存中）
    var module = (__webpack_module_cache__[moduleId] = {
      // 不需要 module.id
      // 无需模块加载
      exports: {},
    });
    // 执行模块功能
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    // 返回模块的导出
    return module.exports;
  }

  /* webpack/runtime/定义属性 getter*/
  (() => {
    // 定义和谐导出的 getter 函数
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
        }
      }
    };
  })();

  /* webpack/runtime/hasOwnProperty 简写*/
  (() => {
    __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();
  /* webpack/runtime/make 命名空间对象*/
  (() => {
    // 在导出时定义 __esModule
    __webpack_require__.r = (exports) => {
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, {
          value: "Module",
        });
      }
      Object.defineProperty(exports, "__esModule", { value: true });
    };
  })();
  // 启动
  // 加载入口模块并返回导出
  // 由于使用了 eval devtool，因此无法内联该入口模块。
  var __webpack_exports__ = __webpack_require__("./src/index.js");
})();
```
做了如下变更：

1. 删除无用注释
2. 将`eval()`变为正常的函数执行。

代码分析：

1. 全部代码包裹在立即执行函数里。
2. `__webpack_modules__`、`__webpack_module_cache__`和`__webpack_require__`定义在最外层，而其他方法包裹在立即执行函数里并挂载到`__webpack_require__`下，如：

	1. `__webpack_require__.d`: 将`definition`对象的属性定义到`exports`下，相当于`exports.log = ....`。

	2. `__webpack_require__.o`: `hasOwnProperty`的简写。

	3. `__webpack_require__.r`: 为`exports`添加`__esModule`，表明是`es`模块。

执行流程分析：

1. `__webpack_require__("./src/index.js")`导入入口文件，判断是否有缓存，有则返回缓存，没有则从`__webpack_modules__`对象获取结果。

2. `__webpack_modules__`是以`文件路径`为key，`function (module, exports, require)`为值的对象，当第一步没有缓存时会根据`./src/index.js`加载文件内容，此例中`index.js`内导入了`util/log.js`，因此会加载`log.js`文件内容(使用`__webpack_require__`方法)
3. `log.js`文件内的`export log`已经被`webpack`处理为挂载到`exports`下，并在`__webpack_require__`方法内返回了`module.exports`，因此在`index.js`获取到`module.exports`后读取`log`方法并执行，即可获得最终结果。
