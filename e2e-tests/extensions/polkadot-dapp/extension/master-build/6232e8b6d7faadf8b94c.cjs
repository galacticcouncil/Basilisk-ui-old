'use strict'
Object.defineProperty(exports, '__esModule', { value: !0 })
var _exportNames = {}
exports.default = void 0
var _bundle = require('./bundle.cjs')
Object.keys(_bundle).forEach(function (e) {
  'default' !== e &&
    '__esModule' !== e &&
    (Object.prototype.hasOwnProperty.call(_exportNames, e) ||
      (e in exports && exports[e] === _bundle[e]) ||
      Object.defineProperty(exports, e, {
        enumerable: !0,
        get: function () {
          return _bundle[e]
        }
      }))
})
var _default = _bundle.settings
exports.default = _default
