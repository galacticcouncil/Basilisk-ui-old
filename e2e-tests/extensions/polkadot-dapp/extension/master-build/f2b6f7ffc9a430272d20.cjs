'use strict'
Object.defineProperty(exports, '__esModule', { value: !0 }),
  require('./detectPackage.cjs')
var _bundle = require('./bundle.cjs')
Object.keys(_bundle).forEach(function (e) {
  'default' !== e &&
    '__esModule' !== e &&
    ((e in exports && exports[e] === _bundle[e]) ||
      Object.defineProperty(exports, e, {
        enumerable: !0,
        get: function () {
          return _bundle[e]
        }
      }))
})
