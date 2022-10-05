;(this['webpackJsonpbasilisk-ui'] = this['webpackJsonpbasilisk-ui'] || []).push(
  [
    [3],
    {
      254: function (e, n, r) {
        'use strict'
        ;(function (e) {
          r.d(n, 'c', function () {
            return v
          }),
            r.d(n, 'b', function () {
              return y
            }),
            r.d(n, 'a', function () {
              return h
            })
          var t = r(255),
            u = 0,
            i = null
          function c() {
            return (
              (null !== i && i.buffer === t.h.buffer) ||
                (i = new Uint8Array(t.h.buffer)),
              i
            )
          }
          var o = new (
              'undefined' === typeof TextEncoder
                ? (0, e.require)('util').TextEncoder
                : TextEncoder
            )('utf-8'),
            a =
              'function' === typeof o.encodeInto
                ? function (e, n) {
                    return o.encodeInto(e, n)
                  }
                : function (e, n) {
                    var r = o.encode(e)
                    return n.set(r), { read: e.length, written: r.length }
                  }
          function f(e, n, r) {
            if (void 0 === r) {
              var t = o.encode(e),
                i = n(t.length)
              return (
                c()
                  .subarray(i, i + t.length)
                  .set(t),
                (u = t.length),
                i
              )
            }
            for (var f = e.length, l = n(f), d = c(), b = 0; b < f; b++) {
              var s = e.charCodeAt(b)
              if (s > 127) break
              d[l + b] = s
            }
            if (b !== f) {
              0 !== b && (e = e.slice(b)), (l = r(l, f, (f = b + 3 * e.length)))
              var v = c().subarray(l + b, l + f)
              b += a(e, v).written
            }
            return (u = b), l
          }
          var l = null
          function d() {
            return (
              (null !== l && l.buffer === t.h.buffer) ||
                (l = new Int32Array(t.h.buffer)),
              l
            )
          }
          var b = new (
            'undefined' === typeof TextDecoder
              ? (0, e.require)('util').TextDecoder
              : TextDecoder
          )('utf-8', { ignoreBOM: !0, fatal: !0 })
          function s(e, n) {
            return b.decode(c().subarray(e, e + n))
          }
          function v(e, n, r) {
            try {
              var i = t.a(-16),
                c = f(e, t.c, t.d),
                o = u,
                a = f(n, t.c, t.d),
                l = u,
                b = f(r, t.c, t.d),
                v = u
              t.g(i, c, o, a, l, b, v)
              var y = d()[i / 4 + 0],
                h = d()[i / 4 + 1]
              return s(y, h)
            } finally {
              t.a(16), t.b(y, h)
            }
          }
          function y(e, n, r) {
            try {
              var i = t.a(-16),
                c = f(e, t.c, t.d),
                o = u,
                a = f(n, t.c, t.d),
                l = u,
                b = f(r, t.c, t.d),
                v = u
              t.f(i, c, o, a, l, b, v)
              var y = d()[i / 4 + 0],
                h = d()[i / 4 + 1]
              return s(y, h)
            } finally {
              t.a(16), t.b(y, h)
            }
          }
          function h(e, n, r) {
            try {
              var i = t.a(-16),
                c = f(e, t.c, t.d),
                o = u,
                a = f(n, t.c, t.d),
                l = u,
                b = f(r, t.c, t.d),
                v = u
              t.e(i, c, o, a, l, b, v)
              var y = d()[i / 4 + 0],
                h = d()[i / 4 + 1]
              return s(y, h)
            } finally {
              t.a(16), t.b(y, h)
            }
          }
          b.decode()
        }.call(this, r(256)(e)))
      },
      255: function (e, n, r) {
        'use strict'
        var t = r.w[e.i]
        ;(e.exports = t), t.i()
      },
      256: function (e, n) {
        e.exports = function (e) {
          if (!e.webpackPolyfill) {
            var n = Object.create(e)
            n.children || (n.children = []),
              Object.defineProperty(n, 'loaded', {
                enumerable: !0,
                get: function () {
                  return n.l
                }
              }),
              Object.defineProperty(n, 'id', {
                enumerable: !0,
                get: function () {
                  return n.i
                }
              }),
              Object.defineProperty(n, 'exports', { enumerable: !0 }),
              (n.webpackPolyfill = 1)
          }
          return n
        }
      },
      257: function (e, n, r) {
        'use strict'
        r.r(n)
        var t = r(254)
        r.d(n, 'get_spot_price', function () {
          return t.c
        }),
          r.d(n, 'calculate_out_given_in', function () {
            return t.b
          }),
          r.d(n, 'calculate_in_given_out', function () {
            return t.a
          })
      }
    }
  ]
)
//# sourceMappingURL=3.17907a6a.chunk.js.map
