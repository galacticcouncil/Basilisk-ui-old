/*! For license information please see page.js.LICENSE.txt */
;(() => {
  var t = {
      766: (t, e) => {
        'use strict'
        ;(e.byteLength = function (t) {
          var e = u(t),
            r = e[0],
            i = e[1]
          return (3 * (r + i)) / 4 - i
        }),
          (e.toByteArray = function (t) {
            var e,
              r,
              o = u(t),
              s = o[0],
              h = o[1],
              a = new n(
                (function (t, e, r) {
                  return (3 * (e + r)) / 4 - r
                })(0, s, h)
              ),
              f = 0,
              l = h > 0 ? s - 4 : s
            for (r = 0; r < l; r += 4)
              (e =
                (i[t.charCodeAt(r)] << 18) |
                (i[t.charCodeAt(r + 1)] << 12) |
                (i[t.charCodeAt(r + 2)] << 6) |
                i[t.charCodeAt(r + 3)]),
                (a[f++] = (e >> 16) & 255),
                (a[f++] = (e >> 8) & 255),
                (a[f++] = 255 & e)
            return (
              2 === h &&
                ((e =
                  (i[t.charCodeAt(r)] << 2) | (i[t.charCodeAt(r + 1)] >> 4)),
                (a[f++] = 255 & e)),
              1 === h &&
                ((e =
                  (i[t.charCodeAt(r)] << 10) |
                  (i[t.charCodeAt(r + 1)] << 4) |
                  (i[t.charCodeAt(r + 2)] >> 2)),
                (a[f++] = (e >> 8) & 255),
                (a[f++] = 255 & e)),
              a
            )
          }),
          (e.fromByteArray = function (t) {
            for (
              var e,
                i = t.length,
                n = i % 3,
                o = [],
                s = 16383,
                h = 0,
                u = i - n;
              h < u;
              h += s
            )
              o.push(a(t, h, h + s > u ? u : h + s))
            return (
              1 === n
                ? ((e = t[i - 1]), o.push(r[e >> 2] + r[(e << 4) & 63] + '=='))
                : 2 === n &&
                  ((e = (t[i - 2] << 8) + t[i - 1]),
                  o.push(
                    r[e >> 10] + r[(e >> 4) & 63] + r[(e << 2) & 63] + '='
                  )),
              o.join('')
            )
          })
        for (
          var r = [],
            i = [],
            n = 'undefined' != typeof Uint8Array ? Uint8Array : Array,
            o =
              'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
            s = 0,
            h = o.length;
          s < h;
          ++s
        )
          (r[s] = o[s]), (i[o.charCodeAt(s)] = s)
        function u(t) {
          var e = t.length
          if (e % 4 > 0)
            throw new Error('Invalid string. Length must be a multiple of 4')
          var r = t.indexOf('=')
          return -1 === r && (r = e), [r, r === e ? 0 : 4 - (r % 4)]
        }
        function a(t, e, i) {
          for (var n, o, s = [], h = e; h < i; h += 3)
            (n =
              ((t[h] << 16) & 16711680) +
              ((t[h + 1] << 8) & 65280) +
              (255 & t[h + 2])),
              s.push(
                r[((o = n) >> 18) & 63] +
                  r[(o >> 12) & 63] +
                  r[(o >> 6) & 63] +
                  r[63 & o]
              )
          return s.join('')
        }
        ;(i['-'.charCodeAt(0)] = 62), (i['_'.charCodeAt(0)] = 63)
      },
      197: function (t, e, r) {
        !(function (t, e) {
          'use strict'
          function i(t, e) {
            if (!t) throw new Error(e || 'Assertion failed')
          }
          function n(t, e) {
            t.super_ = e
            var r = function () {}
            ;(r.prototype = e.prototype),
              (t.prototype = new r()),
              (t.prototype.constructor = t)
          }
          function o(t, e, r) {
            if (o.isBN(t)) return t
            ;(this.negative = 0),
              (this.words = null),
              (this.length = 0),
              (this.red = null),
              null !== t &&
                (('le' !== e && 'be' !== e) || ((r = e), (e = 10)),
                this._init(t || 0, e || 10, r || 'be'))
          }
          var s
          'object' == typeof t ? (t.exports = o) : (e.BN = o),
            (o.BN = o),
            (o.wordSize = 26)
          try {
            s =
              'undefined' != typeof window && void 0 !== window.Buffer
                ? window.Buffer
                : r(196).Buffer
          } catch (t) {}
          function h(t, e) {
            var r = t.charCodeAt(e)
            return r >= 65 && r <= 70
              ? r - 55
              : r >= 97 && r <= 102
              ? r - 87
              : (r - 48) & 15
          }
          function u(t, e, r) {
            var i = h(t, r)
            return r - 1 >= e && (i |= h(t, r - 1) << 4), i
          }
          function a(t, e, r, i) {
            for (var n = 0, o = Math.min(t.length, r), s = e; s < o; s++) {
              var h = t.charCodeAt(s) - 48
              ;(n *= i),
                (n += h >= 49 ? h - 49 + 10 : h >= 17 ? h - 17 + 10 : h)
            }
            return n
          }
          ;(o.isBN = function (t) {
            return (
              t instanceof o ||
              (null !== t &&
                'object' == typeof t &&
                t.constructor.wordSize === o.wordSize &&
                Array.isArray(t.words))
            )
          }),
            (o.max = function (t, e) {
              return t.cmp(e) > 0 ? t : e
            }),
            (o.min = function (t, e) {
              return t.cmp(e) < 0 ? t : e
            }),
            (o.prototype._init = function (t, e, r) {
              if ('number' == typeof t) return this._initNumber(t, e, r)
              if ('object' == typeof t) return this._initArray(t, e, r)
              'hex' === e && (e = 16), i(e === (0 | e) && e >= 2 && e <= 36)
              var n = 0
              '-' === (t = t.toString().replace(/\s+/g, ''))[0] &&
                (n++, (this.negative = 1)),
                n < t.length &&
                  (16 === e
                    ? this._parseHex(t, n, r)
                    : (this._parseBase(t, e, n),
                      'le' === r && this._initArray(this.toArray(), e, r)))
            }),
            (o.prototype._initNumber = function (t, e, r) {
              t < 0 && ((this.negative = 1), (t = -t)),
                t < 67108864
                  ? ((this.words = [67108863 & t]), (this.length = 1))
                  : t < 4503599627370496
                  ? ((this.words = [67108863 & t, (t / 67108864) & 67108863]),
                    (this.length = 2))
                  : (i(t < 9007199254740992),
                    (this.words = [67108863 & t, (t / 67108864) & 67108863, 1]),
                    (this.length = 3)),
                'le' === r && this._initArray(this.toArray(), e, r)
            }),
            (o.prototype._initArray = function (t, e, r) {
              if ((i('number' == typeof t.length), t.length <= 0))
                return (this.words = [0]), (this.length = 1), this
              ;(this.length = Math.ceil(t.length / 3)),
                (this.words = new Array(this.length))
              for (var n = 0; n < this.length; n++) this.words[n] = 0
              var o,
                s,
                h = 0
              if ('be' === r)
                for (n = t.length - 1, o = 0; n >= 0; n -= 3)
                  (s = t[n] | (t[n - 1] << 8) | (t[n - 2] << 16)),
                    (this.words[o] |= (s << h) & 67108863),
                    (this.words[o + 1] = (s >>> (26 - h)) & 67108863),
                    (h += 24) >= 26 && ((h -= 26), o++)
              else if ('le' === r)
                for (n = 0, o = 0; n < t.length; n += 3)
                  (s = t[n] | (t[n + 1] << 8) | (t[n + 2] << 16)),
                    (this.words[o] |= (s << h) & 67108863),
                    (this.words[o + 1] = (s >>> (26 - h)) & 67108863),
                    (h += 24) >= 26 && ((h -= 26), o++)
              return this.strip()
            }),
            (o.prototype._parseHex = function (t, e, r) {
              ;(this.length = Math.ceil((t.length - e) / 6)),
                (this.words = new Array(this.length))
              for (var i = 0; i < this.length; i++) this.words[i] = 0
              var n,
                o = 0,
                s = 0
              if ('be' === r)
                for (i = t.length - 1; i >= e; i -= 2)
                  (n = u(t, e, i) << o),
                    (this.words[s] |= 67108863 & n),
                    o >= 18
                      ? ((o -= 18), (s += 1), (this.words[s] |= n >>> 26))
                      : (o += 8)
              else
                for (
                  i = (t.length - e) % 2 == 0 ? e + 1 : e;
                  i < t.length;
                  i += 2
                )
                  (n = u(t, e, i) << o),
                    (this.words[s] |= 67108863 & n),
                    o >= 18
                      ? ((o -= 18), (s += 1), (this.words[s] |= n >>> 26))
                      : (o += 8)
              this.strip()
            }),
            (o.prototype._parseBase = function (t, e, r) {
              ;(this.words = [0]), (this.length = 1)
              for (var i = 0, n = 1; n <= 67108863; n *= e) i++
              i--, (n = (n / e) | 0)
              for (
                var o = t.length - r,
                  s = o % i,
                  h = Math.min(o, o - s) + r,
                  u = 0,
                  f = r;
                f < h;
                f += i
              )
                (u = a(t, f, f + i, e)),
                  this.imuln(n),
                  this.words[0] + u < 67108864
                    ? (this.words[0] += u)
                    : this._iaddn(u)
              if (0 !== s) {
                var l = 1
                for (u = a(t, f, t.length, e), f = 0; f < s; f++) l *= e
                this.imuln(l),
                  this.words[0] + u < 67108864
                    ? (this.words[0] += u)
                    : this._iaddn(u)
              }
              this.strip()
            }),
            (o.prototype.copy = function (t) {
              t.words = new Array(this.length)
              for (var e = 0; e < this.length; e++) t.words[e] = this.words[e]
              ;(t.length = this.length),
                (t.negative = this.negative),
                (t.red = this.red)
            }),
            (o.prototype.clone = function () {
              var t = new o(null)
              return this.copy(t), t
            }),
            (o.prototype._expand = function (t) {
              for (; this.length < t; ) this.words[this.length++] = 0
              return this
            }),
            (o.prototype.strip = function () {
              for (; this.length > 1 && 0 === this.words[this.length - 1]; )
                this.length--
              return this._normSign()
            }),
            (o.prototype._normSign = function () {
              return (
                1 === this.length && 0 === this.words[0] && (this.negative = 0),
                this
              )
            }),
            (o.prototype.inspect = function () {
              return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>'
            })
          var f = [
              '',
              '0',
              '00',
              '000',
              '0000',
              '00000',
              '000000',
              '0000000',
              '00000000',
              '000000000',
              '0000000000',
              '00000000000',
              '000000000000',
              '0000000000000',
              '00000000000000',
              '000000000000000',
              '0000000000000000',
              '00000000000000000',
              '000000000000000000',
              '0000000000000000000',
              '00000000000000000000',
              '000000000000000000000',
              '0000000000000000000000',
              '00000000000000000000000',
              '000000000000000000000000',
              '0000000000000000000000000'
            ],
            l = [
              0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6,
              6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5
            ],
            c = [
              0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607,
              16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536,
              11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101,
              5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368,
              20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875,
              60466176
            ]
          function p(t, e, r) {
            r.negative = e.negative ^ t.negative
            var i = (t.length + e.length) | 0
            ;(r.length = i), (i = (i - 1) | 0)
            var n = 0 | t.words[0],
              o = 0 | e.words[0],
              s = n * o,
              h = 67108863 & s,
              u = (s / 67108864) | 0
            r.words[0] = h
            for (var a = 1; a < i; a++) {
              for (
                var f = u >>> 26,
                  l = 67108863 & u,
                  c = Math.min(a, e.length - 1),
                  p = Math.max(0, a - t.length + 1);
                p <= c;
                p++
              ) {
                var d = (a - p) | 0
                ;(f +=
                  ((s = (n = 0 | t.words[d]) * (o = 0 | e.words[p]) + l) /
                    67108864) |
                  0),
                  (l = 67108863 & s)
              }
              ;(r.words[a] = 0 | l), (u = 0 | f)
            }
            return 0 !== u ? (r.words[a] = 0 | u) : r.length--, r.strip()
          }
          ;(o.prototype.toString = function (t, e) {
            var r
            if (((e = 0 | e || 1), 16 === (t = t || 10) || 'hex' === t)) {
              r = ''
              for (var n = 0, o = 0, s = 0; s < this.length; s++) {
                var h = this.words[s],
                  u = (16777215 & ((h << n) | o)).toString(16)
                ;(r =
                  0 != (o = (h >>> (24 - n)) & 16777215) ||
                  s !== this.length - 1
                    ? f[6 - u.length] + u + r
                    : u + r),
                  (n += 2) >= 26 && ((n -= 26), s--)
              }
              for (0 !== o && (r = o.toString(16) + r); r.length % e != 0; )
                r = '0' + r
              return 0 !== this.negative && (r = '-' + r), r
            }
            if (t === (0 | t) && t >= 2 && t <= 36) {
              var a = l[t],
                p = c[t]
              r = ''
              var d = this.clone()
              for (d.negative = 0; !d.isZero(); ) {
                var m = d.modn(p).toString(t)
                r = (d = d.idivn(p)).isZero() ? m + r : f[a - m.length] + m + r
              }
              for (this.isZero() && (r = '0' + r); r.length % e != 0; )
                r = '0' + r
              return 0 !== this.negative && (r = '-' + r), r
            }
            i(!1, 'Base should be between 2 and 36')
          }),
            (o.prototype.toNumber = function () {
              var t = this.words[0]
              return (
                2 === this.length
                  ? (t += 67108864 * this.words[1])
                  : 3 === this.length && 1 === this.words[2]
                  ? (t += 4503599627370496 + 67108864 * this.words[1])
                  : this.length > 2 &&
                    i(!1, 'Number can only safely store up to 53 bits'),
                0 !== this.negative ? -t : t
              )
            }),
            (o.prototype.toJSON = function () {
              return this.toString(16)
            }),
            (o.prototype.toBuffer = function (t, e) {
              return i(void 0 !== s), this.toArrayLike(s, t, e)
            }),
            (o.prototype.toArray = function (t, e) {
              return this.toArrayLike(Array, t, e)
            }),
            (o.prototype.toArrayLike = function (t, e, r) {
              var n = this.byteLength(),
                o = r || Math.max(1, n)
              i(n <= o, 'byte array longer than desired length'),
                i(o > 0, 'Requested array length <= 0'),
                this.strip()
              var s,
                h,
                u = 'le' === e,
                a = new t(o),
                f = this.clone()
              if (u) {
                for (h = 0; !f.isZero(); h++)
                  (s = f.andln(255)), f.iushrn(8), (a[h] = s)
                for (; h < o; h++) a[h] = 0
              } else {
                for (h = 0; h < o - n; h++) a[h] = 0
                for (h = 0; !f.isZero(); h++)
                  (s = f.andln(255)), f.iushrn(8), (a[o - h - 1] = s)
              }
              return a
            }),
            Math.clz32
              ? (o.prototype._countBits = function (t) {
                  return 32 - Math.clz32(t)
                })
              : (o.prototype._countBits = function (t) {
                  var e = t,
                    r = 0
                  return (
                    e >= 4096 && ((r += 13), (e >>>= 13)),
                    e >= 64 && ((r += 7), (e >>>= 7)),
                    e >= 8 && ((r += 4), (e >>>= 4)),
                    e >= 2 && ((r += 2), (e >>>= 2)),
                    r + e
                  )
                }),
            (o.prototype._zeroBits = function (t) {
              if (0 === t) return 26
              var e = t,
                r = 0
              return (
                0 == (8191 & e) && ((r += 13), (e >>>= 13)),
                0 == (127 & e) && ((r += 7), (e >>>= 7)),
                0 == (15 & e) && ((r += 4), (e >>>= 4)),
                0 == (3 & e) && ((r += 2), (e >>>= 2)),
                0 == (1 & e) && r++,
                r
              )
            }),
            (o.prototype.bitLength = function () {
              var t = this.words[this.length - 1],
                e = this._countBits(t)
              return 26 * (this.length - 1) + e
            }),
            (o.prototype.zeroBits = function () {
              if (this.isZero()) return 0
              for (var t = 0, e = 0; e < this.length; e++) {
                var r = this._zeroBits(this.words[e])
                if (((t += r), 26 !== r)) break
              }
              return t
            }),
            (o.prototype.byteLength = function () {
              return Math.ceil(this.bitLength() / 8)
            }),
            (o.prototype.toTwos = function (t) {
              return 0 !== this.negative
                ? this.abs().inotn(t).iaddn(1)
                : this.clone()
            }),
            (o.prototype.fromTwos = function (t) {
              return this.testn(t - 1)
                ? this.notn(t).iaddn(1).ineg()
                : this.clone()
            }),
            (o.prototype.isNeg = function () {
              return 0 !== this.negative
            }),
            (o.prototype.neg = function () {
              return this.clone().ineg()
            }),
            (o.prototype.ineg = function () {
              return this.isZero() || (this.negative ^= 1), this
            }),
            (o.prototype.iuor = function (t) {
              for (; this.length < t.length; ) this.words[this.length++] = 0
              for (var e = 0; e < t.length; e++)
                this.words[e] = this.words[e] | t.words[e]
              return this.strip()
            }),
            (o.prototype.ior = function (t) {
              return i(0 == (this.negative | t.negative)), this.iuor(t)
            }),
            (o.prototype.or = function (t) {
              return this.length > t.length
                ? this.clone().ior(t)
                : t.clone().ior(this)
            }),
            (o.prototype.uor = function (t) {
              return this.length > t.length
                ? this.clone().iuor(t)
                : t.clone().iuor(this)
            }),
            (o.prototype.iuand = function (t) {
              var e
              e = this.length > t.length ? t : this
              for (var r = 0; r < e.length; r++)
                this.words[r] = this.words[r] & t.words[r]
              return (this.length = e.length), this.strip()
            }),
            (o.prototype.iand = function (t) {
              return i(0 == (this.negative | t.negative)), this.iuand(t)
            }),
            (o.prototype.and = function (t) {
              return this.length > t.length
                ? this.clone().iand(t)
                : t.clone().iand(this)
            }),
            (o.prototype.uand = function (t) {
              return this.length > t.length
                ? this.clone().iuand(t)
                : t.clone().iuand(this)
            }),
            (o.prototype.iuxor = function (t) {
              var e, r
              this.length > t.length
                ? ((e = this), (r = t))
                : ((e = t), (r = this))
              for (var i = 0; i < r.length; i++)
                this.words[i] = e.words[i] ^ r.words[i]
              if (this !== e)
                for (; i < e.length; i++) this.words[i] = e.words[i]
              return (this.length = e.length), this.strip()
            }),
            (o.prototype.ixor = function (t) {
              return i(0 == (this.negative | t.negative)), this.iuxor(t)
            }),
            (o.prototype.xor = function (t) {
              return this.length > t.length
                ? this.clone().ixor(t)
                : t.clone().ixor(this)
            }),
            (o.prototype.uxor = function (t) {
              return this.length > t.length
                ? this.clone().iuxor(t)
                : t.clone().iuxor(this)
            }),
            (o.prototype.inotn = function (t) {
              i('number' == typeof t && t >= 0)
              var e = 0 | Math.ceil(t / 26),
                r = t % 26
              this._expand(e), r > 0 && e--
              for (var n = 0; n < e; n++)
                this.words[n] = 67108863 & ~this.words[n]
              return (
                r > 0 &&
                  (this.words[n] = ~this.words[n] & (67108863 >> (26 - r))),
                this.strip()
              )
            }),
            (o.prototype.notn = function (t) {
              return this.clone().inotn(t)
            }),
            (o.prototype.setn = function (t, e) {
              i('number' == typeof t && t >= 0)
              var r = (t / 26) | 0,
                n = t % 26
              return (
                this._expand(r + 1),
                (this.words[r] = e
                  ? this.words[r] | (1 << n)
                  : this.words[r] & ~(1 << n)),
                this.strip()
              )
            }),
            (o.prototype.iadd = function (t) {
              var e, r, i
              if (0 !== this.negative && 0 === t.negative)
                return (
                  (this.negative = 0),
                  (e = this.isub(t)),
                  (this.negative ^= 1),
                  this._normSign()
                )
              if (0 === this.negative && 0 !== t.negative)
                return (
                  (t.negative = 0),
                  (e = this.isub(t)),
                  (t.negative = 1),
                  e._normSign()
                )
              this.length > t.length
                ? ((r = this), (i = t))
                : ((r = t), (i = this))
              for (var n = 0, o = 0; o < i.length; o++)
                (e = (0 | r.words[o]) + (0 | i.words[o]) + n),
                  (this.words[o] = 67108863 & e),
                  (n = e >>> 26)
              for (; 0 !== n && o < r.length; o++)
                (e = (0 | r.words[o]) + n),
                  (this.words[o] = 67108863 & e),
                  (n = e >>> 26)
              if (((this.length = r.length), 0 !== n))
                (this.words[this.length] = n), this.length++
              else if (r !== this)
                for (; o < r.length; o++) this.words[o] = r.words[o]
              return this
            }),
            (o.prototype.add = function (t) {
              var e
              return 0 !== t.negative && 0 === this.negative
                ? ((t.negative = 0), (e = this.sub(t)), (t.negative ^= 1), e)
                : 0 === t.negative && 0 !== this.negative
                ? ((this.negative = 0),
                  (e = t.sub(this)),
                  (this.negative = 1),
                  e)
                : this.length > t.length
                ? this.clone().iadd(t)
                : t.clone().iadd(this)
            }),
            (o.prototype.isub = function (t) {
              if (0 !== t.negative) {
                t.negative = 0
                var e = this.iadd(t)
                return (t.negative = 1), e._normSign()
              }
              if (0 !== this.negative)
                return (
                  (this.negative = 0),
                  this.iadd(t),
                  (this.negative = 1),
                  this._normSign()
                )
              var r,
                i,
                n = this.cmp(t)
              if (0 === n)
                return (
                  (this.negative = 0),
                  (this.length = 1),
                  (this.words[0] = 0),
                  this
                )
              n > 0 ? ((r = this), (i = t)) : ((r = t), (i = this))
              for (var o = 0, s = 0; s < i.length; s++)
                (o = (e = (0 | r.words[s]) - (0 | i.words[s]) + o) >> 26),
                  (this.words[s] = 67108863 & e)
              for (; 0 !== o && s < r.length; s++)
                (o = (e = (0 | r.words[s]) + o) >> 26),
                  (this.words[s] = 67108863 & e)
              if (0 === o && s < r.length && r !== this)
                for (; s < r.length; s++) this.words[s] = r.words[s]
              return (
                (this.length = Math.max(this.length, s)),
                r !== this && (this.negative = 1),
                this.strip()
              )
            }),
            (o.prototype.sub = function (t) {
              return this.clone().isub(t)
            })
          var d = function (t, e, r) {
            var i,
              n,
              o,
              s = t.words,
              h = e.words,
              u = r.words,
              a = 0,
              f = 0 | s[0],
              l = 8191 & f,
              c = f >>> 13,
              p = 0 | s[1],
              d = 8191 & p,
              m = p >>> 13,
              g = 0 | s[2],
              y = 8191 & g,
              w = g >>> 13,
              v = 0 | s[3],
              M = 8191 & v,
              b = v >>> 13,
              B = 0 | s[4],
              A = 8191 & B,
              E = B >>> 13,
              _ = 0 | s[5],
              I = 8191 & _,
              U = _ >>> 13,
              x = 0 | s[6],
              R = 8191 & x,
              T = x >>> 13,
              S = 0 | s[7],
              L = 8191 & S,
              O = S >>> 13,
              k = 0 | s[8],
              N = 8191 & k,
              $ = k >>> 13,
              C = 0 | s[9],
              P = 8191 & C,
              j = C >>> 13,
              q = 0 | h[0],
              Z = 8191 & q,
              F = q >>> 13,
              D = 0 | h[1],
              z = 8191 & D,
              W = D >>> 13,
              Y = 0 | h[2],
              G = 8191 & Y,
              V = Y >>> 13,
              X = 0 | h[3],
              K = 8191 & X,
              H = X >>> 13,
              J = 0 | h[4],
              Q = 8191 & J,
              tt = J >>> 13,
              et = 0 | h[5],
              rt = 8191 & et,
              it = et >>> 13,
              nt = 0 | h[6],
              ot = 8191 & nt,
              st = nt >>> 13,
              ht = 0 | h[7],
              ut = 8191 & ht,
              at = ht >>> 13,
              ft = 0 | h[8],
              lt = 8191 & ft,
              ct = ft >>> 13,
              pt = 0 | h[9],
              dt = 8191 & pt,
              mt = pt >>> 13
            ;(r.negative = t.negative ^ e.negative), (r.length = 19)
            var gt =
              (((a + (i = Math.imul(l, Z))) | 0) +
                ((8191 & (n = ((n = Math.imul(l, F)) + Math.imul(c, Z)) | 0)) <<
                  13)) |
              0
            ;(a =
              ((((o = Math.imul(c, F)) + (n >>> 13)) | 0) + (gt >>> 26)) | 0),
              (gt &= 67108863),
              (i = Math.imul(d, Z)),
              (n = ((n = Math.imul(d, F)) + Math.imul(m, Z)) | 0),
              (o = Math.imul(m, F))
            var yt =
              (((a + (i = (i + Math.imul(l, z)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(l, W)) | 0) + Math.imul(c, z)) | 0)) <<
                  13)) |
              0
            ;(a =
              ((((o = (o + Math.imul(c, W)) | 0) + (n >>> 13)) | 0) +
                (yt >>> 26)) |
              0),
              (yt &= 67108863),
              (i = Math.imul(y, Z)),
              (n = ((n = Math.imul(y, F)) + Math.imul(w, Z)) | 0),
              (o = Math.imul(w, F)),
              (i = (i + Math.imul(d, z)) | 0),
              (n = ((n = (n + Math.imul(d, W)) | 0) + Math.imul(m, z)) | 0),
              (o = (o + Math.imul(m, W)) | 0)
            var wt =
              (((a + (i = (i + Math.imul(l, G)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(l, V)) | 0) + Math.imul(c, G)) | 0)) <<
                  13)) |
              0
            ;(a =
              ((((o = (o + Math.imul(c, V)) | 0) + (n >>> 13)) | 0) +
                (wt >>> 26)) |
              0),
              (wt &= 67108863),
              (i = Math.imul(M, Z)),
              (n = ((n = Math.imul(M, F)) + Math.imul(b, Z)) | 0),
              (o = Math.imul(b, F)),
              (i = (i + Math.imul(y, z)) | 0),
              (n = ((n = (n + Math.imul(y, W)) | 0) + Math.imul(w, z)) | 0),
              (o = (o + Math.imul(w, W)) | 0),
              (i = (i + Math.imul(d, G)) | 0),
              (n = ((n = (n + Math.imul(d, V)) | 0) + Math.imul(m, G)) | 0),
              (o = (o + Math.imul(m, V)) | 0)
            var vt =
              (((a + (i = (i + Math.imul(l, K)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(l, H)) | 0) + Math.imul(c, K)) | 0)) <<
                  13)) |
              0
            ;(a =
              ((((o = (o + Math.imul(c, H)) | 0) + (n >>> 13)) | 0) +
                (vt >>> 26)) |
              0),
              (vt &= 67108863),
              (i = Math.imul(A, Z)),
              (n = ((n = Math.imul(A, F)) + Math.imul(E, Z)) | 0),
              (o = Math.imul(E, F)),
              (i = (i + Math.imul(M, z)) | 0),
              (n = ((n = (n + Math.imul(M, W)) | 0) + Math.imul(b, z)) | 0),
              (o = (o + Math.imul(b, W)) | 0),
              (i = (i + Math.imul(y, G)) | 0),
              (n = ((n = (n + Math.imul(y, V)) | 0) + Math.imul(w, G)) | 0),
              (o = (o + Math.imul(w, V)) | 0),
              (i = (i + Math.imul(d, K)) | 0),
              (n = ((n = (n + Math.imul(d, H)) | 0) + Math.imul(m, K)) | 0),
              (o = (o + Math.imul(m, H)) | 0)
            var Mt =
              (((a + (i = (i + Math.imul(l, Q)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(l, tt)) | 0) + Math.imul(c, Q)) |
                    0)) <<
                  13)) |
              0
            ;(a =
              ((((o = (o + Math.imul(c, tt)) | 0) + (n >>> 13)) | 0) +
                (Mt >>> 26)) |
              0),
              (Mt &= 67108863),
              (i = Math.imul(I, Z)),
              (n = ((n = Math.imul(I, F)) + Math.imul(U, Z)) | 0),
              (o = Math.imul(U, F)),
              (i = (i + Math.imul(A, z)) | 0),
              (n = ((n = (n + Math.imul(A, W)) | 0) + Math.imul(E, z)) | 0),
              (o = (o + Math.imul(E, W)) | 0),
              (i = (i + Math.imul(M, G)) | 0),
              (n = ((n = (n + Math.imul(M, V)) | 0) + Math.imul(b, G)) | 0),
              (o = (o + Math.imul(b, V)) | 0),
              (i = (i + Math.imul(y, K)) | 0),
              (n = ((n = (n + Math.imul(y, H)) | 0) + Math.imul(w, K)) | 0),
              (o = (o + Math.imul(w, H)) | 0),
              (i = (i + Math.imul(d, Q)) | 0),
              (n = ((n = (n + Math.imul(d, tt)) | 0) + Math.imul(m, Q)) | 0),
              (o = (o + Math.imul(m, tt)) | 0)
            var bt =
              (((a + (i = (i + Math.imul(l, rt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(l, it)) | 0) + Math.imul(c, rt)) |
                    0)) <<
                  13)) |
              0
            ;(a =
              ((((o = (o + Math.imul(c, it)) | 0) + (n >>> 13)) | 0) +
                (bt >>> 26)) |
              0),
              (bt &= 67108863),
              (i = Math.imul(R, Z)),
              (n = ((n = Math.imul(R, F)) + Math.imul(T, Z)) | 0),
              (o = Math.imul(T, F)),
              (i = (i + Math.imul(I, z)) | 0),
              (n = ((n = (n + Math.imul(I, W)) | 0) + Math.imul(U, z)) | 0),
              (o = (o + Math.imul(U, W)) | 0),
              (i = (i + Math.imul(A, G)) | 0),
              (n = ((n = (n + Math.imul(A, V)) | 0) + Math.imul(E, G)) | 0),
              (o = (o + Math.imul(E, V)) | 0),
              (i = (i + Math.imul(M, K)) | 0),
              (n = ((n = (n + Math.imul(M, H)) | 0) + Math.imul(b, K)) | 0),
              (o = (o + Math.imul(b, H)) | 0),
              (i = (i + Math.imul(y, Q)) | 0),
              (n = ((n = (n + Math.imul(y, tt)) | 0) + Math.imul(w, Q)) | 0),
              (o = (o + Math.imul(w, tt)) | 0),
              (i = (i + Math.imul(d, rt)) | 0),
              (n = ((n = (n + Math.imul(d, it)) | 0) + Math.imul(m, rt)) | 0),
              (o = (o + Math.imul(m, it)) | 0)
            var Bt =
              (((a + (i = (i + Math.imul(l, ot)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(l, st)) | 0) + Math.imul(c, ot)) |
                    0)) <<
                  13)) |
              0
            ;(a =
              ((((o = (o + Math.imul(c, st)) | 0) + (n >>> 13)) | 0) +
                (Bt >>> 26)) |
              0),
              (Bt &= 67108863),
              (i = Math.imul(L, Z)),
              (n = ((n = Math.imul(L, F)) + Math.imul(O, Z)) | 0),
              (o = Math.imul(O, F)),
              (i = (i + Math.imul(R, z)) | 0),
              (n = ((n = (n + Math.imul(R, W)) | 0) + Math.imul(T, z)) | 0),
              (o = (o + Math.imul(T, W)) | 0),
              (i = (i + Math.imul(I, G)) | 0),
              (n = ((n = (n + Math.imul(I, V)) | 0) + Math.imul(U, G)) | 0),
              (o = (o + Math.imul(U, V)) | 0),
              (i = (i + Math.imul(A, K)) | 0),
              (n = ((n = (n + Math.imul(A, H)) | 0) + Math.imul(E, K)) | 0),
              (o = (o + Math.imul(E, H)) | 0),
              (i = (i + Math.imul(M, Q)) | 0),
              (n = ((n = (n + Math.imul(M, tt)) | 0) + Math.imul(b, Q)) | 0),
              (o = (o + Math.imul(b, tt)) | 0),
              (i = (i + Math.imul(y, rt)) | 0),
              (n = ((n = (n + Math.imul(y, it)) | 0) + Math.imul(w, rt)) | 0),
              (o = (o + Math.imul(w, it)) | 0),
              (i = (i + Math.imul(d, ot)) | 0),
              (n = ((n = (n + Math.imul(d, st)) | 0) + Math.imul(m, ot)) | 0),
              (o = (o + Math.imul(m, st)) | 0)
            var At =
              (((a + (i = (i + Math.imul(l, ut)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(l, at)) | 0) + Math.imul(c, ut)) |
                    0)) <<
                  13)) |
              0
            ;(a =
              ((((o = (o + Math.imul(c, at)) | 0) + (n >>> 13)) | 0) +
                (At >>> 26)) |
              0),
              (At &= 67108863),
              (i = Math.imul(N, Z)),
              (n = ((n = Math.imul(N, F)) + Math.imul($, Z)) | 0),
              (o = Math.imul($, F)),
              (i = (i + Math.imul(L, z)) | 0),
              (n = ((n = (n + Math.imul(L, W)) | 0) + Math.imul(O, z)) | 0),
              (o = (o + Math.imul(O, W)) | 0),
              (i = (i + Math.imul(R, G)) | 0),
              (n = ((n = (n + Math.imul(R, V)) | 0) + Math.imul(T, G)) | 0),
              (o = (o + Math.imul(T, V)) | 0),
              (i = (i + Math.imul(I, K)) | 0),
              (n = ((n = (n + Math.imul(I, H)) | 0) + Math.imul(U, K)) | 0),
              (o = (o + Math.imul(U, H)) | 0),
              (i = (i + Math.imul(A, Q)) | 0),
              (n = ((n = (n + Math.imul(A, tt)) | 0) + Math.imul(E, Q)) | 0),
              (o = (o + Math.imul(E, tt)) | 0),
              (i = (i + Math.imul(M, rt)) | 0),
              (n = ((n = (n + Math.imul(M, it)) | 0) + Math.imul(b, rt)) | 0),
              (o = (o + Math.imul(b, it)) | 0),
              (i = (i + Math.imul(y, ot)) | 0),
              (n = ((n = (n + Math.imul(y, st)) | 0) + Math.imul(w, ot)) | 0),
              (o = (o + Math.imul(w, st)) | 0),
              (i = (i + Math.imul(d, ut)) | 0),
              (n = ((n = (n + Math.imul(d, at)) | 0) + Math.imul(m, ut)) | 0),
              (o = (o + Math.imul(m, at)) | 0)
            var Et =
              (((a + (i = (i + Math.imul(l, lt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(l, ct)) | 0) + Math.imul(c, lt)) |
                    0)) <<
                  13)) |
              0
            ;(a =
              ((((o = (o + Math.imul(c, ct)) | 0) + (n >>> 13)) | 0) +
                (Et >>> 26)) |
              0),
              (Et &= 67108863),
              (i = Math.imul(P, Z)),
              (n = ((n = Math.imul(P, F)) + Math.imul(j, Z)) | 0),
              (o = Math.imul(j, F)),
              (i = (i + Math.imul(N, z)) | 0),
              (n = ((n = (n + Math.imul(N, W)) | 0) + Math.imul($, z)) | 0),
              (o = (o + Math.imul($, W)) | 0),
              (i = (i + Math.imul(L, G)) | 0),
              (n = ((n = (n + Math.imul(L, V)) | 0) + Math.imul(O, G)) | 0),
              (o = (o + Math.imul(O, V)) | 0),
              (i = (i + Math.imul(R, K)) | 0),
              (n = ((n = (n + Math.imul(R, H)) | 0) + Math.imul(T, K)) | 0),
              (o = (o + Math.imul(T, H)) | 0),
              (i = (i + Math.imul(I, Q)) | 0),
              (n = ((n = (n + Math.imul(I, tt)) | 0) + Math.imul(U, Q)) | 0),
              (o = (o + Math.imul(U, tt)) | 0),
              (i = (i + Math.imul(A, rt)) | 0),
              (n = ((n = (n + Math.imul(A, it)) | 0) + Math.imul(E, rt)) | 0),
              (o = (o + Math.imul(E, it)) | 0),
              (i = (i + Math.imul(M, ot)) | 0),
              (n = ((n = (n + Math.imul(M, st)) | 0) + Math.imul(b, ot)) | 0),
              (o = (o + Math.imul(b, st)) | 0),
              (i = (i + Math.imul(y, ut)) | 0),
              (n = ((n = (n + Math.imul(y, at)) | 0) + Math.imul(w, ut)) | 0),
              (o = (o + Math.imul(w, at)) | 0),
              (i = (i + Math.imul(d, lt)) | 0),
              (n = ((n = (n + Math.imul(d, ct)) | 0) + Math.imul(m, lt)) | 0),
              (o = (o + Math.imul(m, ct)) | 0)
            var _t =
              (((a + (i = (i + Math.imul(l, dt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(l, mt)) | 0) + Math.imul(c, dt)) |
                    0)) <<
                  13)) |
              0
            ;(a =
              ((((o = (o + Math.imul(c, mt)) | 0) + (n >>> 13)) | 0) +
                (_t >>> 26)) |
              0),
              (_t &= 67108863),
              (i = Math.imul(P, z)),
              (n = ((n = Math.imul(P, W)) + Math.imul(j, z)) | 0),
              (o = Math.imul(j, W)),
              (i = (i + Math.imul(N, G)) | 0),
              (n = ((n = (n + Math.imul(N, V)) | 0) + Math.imul($, G)) | 0),
              (o = (o + Math.imul($, V)) | 0),
              (i = (i + Math.imul(L, K)) | 0),
              (n = ((n = (n + Math.imul(L, H)) | 0) + Math.imul(O, K)) | 0),
              (o = (o + Math.imul(O, H)) | 0),
              (i = (i + Math.imul(R, Q)) | 0),
              (n = ((n = (n + Math.imul(R, tt)) | 0) + Math.imul(T, Q)) | 0),
              (o = (o + Math.imul(T, tt)) | 0),
              (i = (i + Math.imul(I, rt)) | 0),
              (n = ((n = (n + Math.imul(I, it)) | 0) + Math.imul(U, rt)) | 0),
              (o = (o + Math.imul(U, it)) | 0),
              (i = (i + Math.imul(A, ot)) | 0),
              (n = ((n = (n + Math.imul(A, st)) | 0) + Math.imul(E, ot)) | 0),
              (o = (o + Math.imul(E, st)) | 0),
              (i = (i + Math.imul(M, ut)) | 0),
              (n = ((n = (n + Math.imul(M, at)) | 0) + Math.imul(b, ut)) | 0),
              (o = (o + Math.imul(b, at)) | 0),
              (i = (i + Math.imul(y, lt)) | 0),
              (n = ((n = (n + Math.imul(y, ct)) | 0) + Math.imul(w, lt)) | 0),
              (o = (o + Math.imul(w, ct)) | 0)
            var It =
              (((a + (i = (i + Math.imul(d, dt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(d, mt)) | 0) + Math.imul(m, dt)) |
                    0)) <<
                  13)) |
              0
            ;(a =
              ((((o = (o + Math.imul(m, mt)) | 0) + (n >>> 13)) | 0) +
                (It >>> 26)) |
              0),
              (It &= 67108863),
              (i = Math.imul(P, G)),
              (n = ((n = Math.imul(P, V)) + Math.imul(j, G)) | 0),
              (o = Math.imul(j, V)),
              (i = (i + Math.imul(N, K)) | 0),
              (n = ((n = (n + Math.imul(N, H)) | 0) + Math.imul($, K)) | 0),
              (o = (o + Math.imul($, H)) | 0),
              (i = (i + Math.imul(L, Q)) | 0),
              (n = ((n = (n + Math.imul(L, tt)) | 0) + Math.imul(O, Q)) | 0),
              (o = (o + Math.imul(O, tt)) | 0),
              (i = (i + Math.imul(R, rt)) | 0),
              (n = ((n = (n + Math.imul(R, it)) | 0) + Math.imul(T, rt)) | 0),
              (o = (o + Math.imul(T, it)) | 0),
              (i = (i + Math.imul(I, ot)) | 0),
              (n = ((n = (n + Math.imul(I, st)) | 0) + Math.imul(U, ot)) | 0),
              (o = (o + Math.imul(U, st)) | 0),
              (i = (i + Math.imul(A, ut)) | 0),
              (n = ((n = (n + Math.imul(A, at)) | 0) + Math.imul(E, ut)) | 0),
              (o = (o + Math.imul(E, at)) | 0),
              (i = (i + Math.imul(M, lt)) | 0),
              (n = ((n = (n + Math.imul(M, ct)) | 0) + Math.imul(b, lt)) | 0),
              (o = (o + Math.imul(b, ct)) | 0)
            var Ut =
              (((a + (i = (i + Math.imul(y, dt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(y, mt)) | 0) + Math.imul(w, dt)) |
                    0)) <<
                  13)) |
              0
            ;(a =
              ((((o = (o + Math.imul(w, mt)) | 0) + (n >>> 13)) | 0) +
                (Ut >>> 26)) |
              0),
              (Ut &= 67108863),
              (i = Math.imul(P, K)),
              (n = ((n = Math.imul(P, H)) + Math.imul(j, K)) | 0),
              (o = Math.imul(j, H)),
              (i = (i + Math.imul(N, Q)) | 0),
              (n = ((n = (n + Math.imul(N, tt)) | 0) + Math.imul($, Q)) | 0),
              (o = (o + Math.imul($, tt)) | 0),
              (i = (i + Math.imul(L, rt)) | 0),
              (n = ((n = (n + Math.imul(L, it)) | 0) + Math.imul(O, rt)) | 0),
              (o = (o + Math.imul(O, it)) | 0),
              (i = (i + Math.imul(R, ot)) | 0),
              (n = ((n = (n + Math.imul(R, st)) | 0) + Math.imul(T, ot)) | 0),
              (o = (o + Math.imul(T, st)) | 0),
              (i = (i + Math.imul(I, ut)) | 0),
              (n = ((n = (n + Math.imul(I, at)) | 0) + Math.imul(U, ut)) | 0),
              (o = (o + Math.imul(U, at)) | 0),
              (i = (i + Math.imul(A, lt)) | 0),
              (n = ((n = (n + Math.imul(A, ct)) | 0) + Math.imul(E, lt)) | 0),
              (o = (o + Math.imul(E, ct)) | 0)
            var xt =
              (((a + (i = (i + Math.imul(M, dt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(M, mt)) | 0) + Math.imul(b, dt)) |
                    0)) <<
                  13)) |
              0
            ;(a =
              ((((o = (o + Math.imul(b, mt)) | 0) + (n >>> 13)) | 0) +
                (xt >>> 26)) |
              0),
              (xt &= 67108863),
              (i = Math.imul(P, Q)),
              (n = ((n = Math.imul(P, tt)) + Math.imul(j, Q)) | 0),
              (o = Math.imul(j, tt)),
              (i = (i + Math.imul(N, rt)) | 0),
              (n = ((n = (n + Math.imul(N, it)) | 0) + Math.imul($, rt)) | 0),
              (o = (o + Math.imul($, it)) | 0),
              (i = (i + Math.imul(L, ot)) | 0),
              (n = ((n = (n + Math.imul(L, st)) | 0) + Math.imul(O, ot)) | 0),
              (o = (o + Math.imul(O, st)) | 0),
              (i = (i + Math.imul(R, ut)) | 0),
              (n = ((n = (n + Math.imul(R, at)) | 0) + Math.imul(T, ut)) | 0),
              (o = (o + Math.imul(T, at)) | 0),
              (i = (i + Math.imul(I, lt)) | 0),
              (n = ((n = (n + Math.imul(I, ct)) | 0) + Math.imul(U, lt)) | 0),
              (o = (o + Math.imul(U, ct)) | 0)
            var Rt =
              (((a + (i = (i + Math.imul(A, dt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(A, mt)) | 0) + Math.imul(E, dt)) |
                    0)) <<
                  13)) |
              0
            ;(a =
              ((((o = (o + Math.imul(E, mt)) | 0) + (n >>> 13)) | 0) +
                (Rt >>> 26)) |
              0),
              (Rt &= 67108863),
              (i = Math.imul(P, rt)),
              (n = ((n = Math.imul(P, it)) + Math.imul(j, rt)) | 0),
              (o = Math.imul(j, it)),
              (i = (i + Math.imul(N, ot)) | 0),
              (n = ((n = (n + Math.imul(N, st)) | 0) + Math.imul($, ot)) | 0),
              (o = (o + Math.imul($, st)) | 0),
              (i = (i + Math.imul(L, ut)) | 0),
              (n = ((n = (n + Math.imul(L, at)) | 0) + Math.imul(O, ut)) | 0),
              (o = (o + Math.imul(O, at)) | 0),
              (i = (i + Math.imul(R, lt)) | 0),
              (n = ((n = (n + Math.imul(R, ct)) | 0) + Math.imul(T, lt)) | 0),
              (o = (o + Math.imul(T, ct)) | 0)
            var Tt =
              (((a + (i = (i + Math.imul(I, dt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(I, mt)) | 0) + Math.imul(U, dt)) |
                    0)) <<
                  13)) |
              0
            ;(a =
              ((((o = (o + Math.imul(U, mt)) | 0) + (n >>> 13)) | 0) +
                (Tt >>> 26)) |
              0),
              (Tt &= 67108863),
              (i = Math.imul(P, ot)),
              (n = ((n = Math.imul(P, st)) + Math.imul(j, ot)) | 0),
              (o = Math.imul(j, st)),
              (i = (i + Math.imul(N, ut)) | 0),
              (n = ((n = (n + Math.imul(N, at)) | 0) + Math.imul($, ut)) | 0),
              (o = (o + Math.imul($, at)) | 0),
              (i = (i + Math.imul(L, lt)) | 0),
              (n = ((n = (n + Math.imul(L, ct)) | 0) + Math.imul(O, lt)) | 0),
              (o = (o + Math.imul(O, ct)) | 0)
            var St =
              (((a + (i = (i + Math.imul(R, dt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(R, mt)) | 0) + Math.imul(T, dt)) |
                    0)) <<
                  13)) |
              0
            ;(a =
              ((((o = (o + Math.imul(T, mt)) | 0) + (n >>> 13)) | 0) +
                (St >>> 26)) |
              0),
              (St &= 67108863),
              (i = Math.imul(P, ut)),
              (n = ((n = Math.imul(P, at)) + Math.imul(j, ut)) | 0),
              (o = Math.imul(j, at)),
              (i = (i + Math.imul(N, lt)) | 0),
              (n = ((n = (n + Math.imul(N, ct)) | 0) + Math.imul($, lt)) | 0),
              (o = (o + Math.imul($, ct)) | 0)
            var Lt =
              (((a + (i = (i + Math.imul(L, dt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(L, mt)) | 0) + Math.imul(O, dt)) |
                    0)) <<
                  13)) |
              0
            ;(a =
              ((((o = (o + Math.imul(O, mt)) | 0) + (n >>> 13)) | 0) +
                (Lt >>> 26)) |
              0),
              (Lt &= 67108863),
              (i = Math.imul(P, lt)),
              (n = ((n = Math.imul(P, ct)) + Math.imul(j, lt)) | 0),
              (o = Math.imul(j, ct))
            var Ot =
              (((a + (i = (i + Math.imul(N, dt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(N, mt)) | 0) + Math.imul($, dt)) |
                    0)) <<
                  13)) |
              0
            ;(a =
              ((((o = (o + Math.imul($, mt)) | 0) + (n >>> 13)) | 0) +
                (Ot >>> 26)) |
              0),
              (Ot &= 67108863)
            var kt =
              (((a + (i = Math.imul(P, dt))) | 0) +
                ((8191 &
                  (n = ((n = Math.imul(P, mt)) + Math.imul(j, dt)) | 0)) <<
                  13)) |
              0
            return (
              (a =
                ((((o = Math.imul(j, mt)) + (n >>> 13)) | 0) + (kt >>> 26)) |
                0),
              (kt &= 67108863),
              (u[0] = gt),
              (u[1] = yt),
              (u[2] = wt),
              (u[3] = vt),
              (u[4] = Mt),
              (u[5] = bt),
              (u[6] = Bt),
              (u[7] = At),
              (u[8] = Et),
              (u[9] = _t),
              (u[10] = It),
              (u[11] = Ut),
              (u[12] = xt),
              (u[13] = Rt),
              (u[14] = Tt),
              (u[15] = St),
              (u[16] = Lt),
              (u[17] = Ot),
              (u[18] = kt),
              0 !== a && ((u[19] = a), r.length++),
              r
            )
          }
          function m(t, e, r) {
            return new g().mulp(t, e, r)
          }
          function g(t, e) {
            ;(this.x = t), (this.y = e)
          }
          Math.imul || (d = p),
            (o.prototype.mulTo = function (t, e) {
              var r = this.length + t.length
              return 10 === this.length && 10 === t.length
                ? d(this, t, e)
                : r < 63
                ? p(this, t, e)
                : r < 1024
                ? (function (t, e, r) {
                    ;(r.negative = e.negative ^ t.negative),
                      (r.length = t.length + e.length)
                    for (var i = 0, n = 0, o = 0; o < r.length - 1; o++) {
                      var s = n
                      n = 0
                      for (
                        var h = 67108863 & i,
                          u = Math.min(o, e.length - 1),
                          a = Math.max(0, o - t.length + 1);
                        a <= u;
                        a++
                      ) {
                        var f = o - a,
                          l = (0 | t.words[f]) * (0 | e.words[a]),
                          c = 67108863 & l
                        ;(h = 67108863 & (c = (c + h) | 0)),
                          (n +=
                            (s =
                              ((s = (s + ((l / 67108864) | 0)) | 0) +
                                (c >>> 26)) |
                              0) >>> 26),
                          (s &= 67108863)
                      }
                      ;(r.words[o] = h), (i = s), (s = n)
                    }
                    return 0 !== i ? (r.words[o] = i) : r.length--, r.strip()
                  })(this, t, e)
                : m(this, t, e)
            }),
            (g.prototype.makeRBT = function (t) {
              for (
                var e = new Array(t), r = o.prototype._countBits(t) - 1, i = 0;
                i < t;
                i++
              )
                e[i] = this.revBin(i, r, t)
              return e
            }),
            (g.prototype.revBin = function (t, e, r) {
              if (0 === t || t === r - 1) return t
              for (var i = 0, n = 0; n < e; n++)
                (i |= (1 & t) << (e - n - 1)), (t >>= 1)
              return i
            }),
            (g.prototype.permute = function (t, e, r, i, n, o) {
              for (var s = 0; s < o; s++) (i[s] = e[t[s]]), (n[s] = r[t[s]])
            }),
            (g.prototype.transform = function (t, e, r, i, n, o) {
              this.permute(o, t, e, r, i, n)
              for (var s = 1; s < n; s <<= 1)
                for (
                  var h = s << 1,
                    u = Math.cos((2 * Math.PI) / h),
                    a = Math.sin((2 * Math.PI) / h),
                    f = 0;
                  f < n;
                  f += h
                )
                  for (var l = u, c = a, p = 0; p < s; p++) {
                    var d = r[f + p],
                      m = i[f + p],
                      g = r[f + p + s],
                      y = i[f + p + s],
                      w = l * g - c * y
                    ;(y = l * y + c * g),
                      (g = w),
                      (r[f + p] = d + g),
                      (i[f + p] = m + y),
                      (r[f + p + s] = d - g),
                      (i[f + p + s] = m - y),
                      p !== h &&
                        ((w = u * l - a * c), (c = u * c + a * l), (l = w))
                  }
            }),
            (g.prototype.guessLen13b = function (t, e) {
              var r = 1 | Math.max(e, t),
                i = 1 & r,
                n = 0
              for (r = (r / 2) | 0; r; r >>>= 1) n++
              return 1 << (n + 1 + i)
            }),
            (g.prototype.conjugate = function (t, e, r) {
              if (!(r <= 1))
                for (var i = 0; i < r / 2; i++) {
                  var n = t[i]
                  ;(t[i] = t[r - i - 1]),
                    (t[r - i - 1] = n),
                    (n = e[i]),
                    (e[i] = -e[r - i - 1]),
                    (e[r - i - 1] = -n)
                }
            }),
            (g.prototype.normalize13b = function (t, e) {
              for (var r = 0, i = 0; i < e / 2; i++) {
                var n =
                  8192 * Math.round(t[2 * i + 1] / e) +
                  Math.round(t[2 * i] / e) +
                  r
                ;(t[i] = 67108863 & n),
                  (r = n < 67108864 ? 0 : (n / 67108864) | 0)
              }
              return t
            }),
            (g.prototype.convert13b = function (t, e, r, n) {
              for (var o = 0, s = 0; s < e; s++)
                (o += 0 | t[s]),
                  (r[2 * s] = 8191 & o),
                  (o >>>= 13),
                  (r[2 * s + 1] = 8191 & o),
                  (o >>>= 13)
              for (s = 2 * e; s < n; ++s) r[s] = 0
              i(0 === o), i(0 == (-8192 & o))
            }),
            (g.prototype.stub = function (t) {
              for (var e = new Array(t), r = 0; r < t; r++) e[r] = 0
              return e
            }),
            (g.prototype.mulp = function (t, e, r) {
              var i = 2 * this.guessLen13b(t.length, e.length),
                n = this.makeRBT(i),
                o = this.stub(i),
                s = new Array(i),
                h = new Array(i),
                u = new Array(i),
                a = new Array(i),
                f = new Array(i),
                l = new Array(i),
                c = r.words
              ;(c.length = i),
                this.convert13b(t.words, t.length, s, i),
                this.convert13b(e.words, e.length, a, i),
                this.transform(s, o, h, u, i, n),
                this.transform(a, o, f, l, i, n)
              for (var p = 0; p < i; p++) {
                var d = h[p] * f[p] - u[p] * l[p]
                ;(u[p] = h[p] * l[p] + u[p] * f[p]), (h[p] = d)
              }
              return (
                this.conjugate(h, u, i),
                this.transform(h, u, c, o, i, n),
                this.conjugate(c, o, i),
                this.normalize13b(c, i),
                (r.negative = t.negative ^ e.negative),
                (r.length = t.length + e.length),
                r.strip()
              )
            }),
            (o.prototype.mul = function (t) {
              var e = new o(null)
              return (
                (e.words = new Array(this.length + t.length)), this.mulTo(t, e)
              )
            }),
            (o.prototype.mulf = function (t) {
              var e = new o(null)
              return (
                (e.words = new Array(this.length + t.length)), m(this, t, e)
              )
            }),
            (o.prototype.imul = function (t) {
              return this.clone().mulTo(t, this)
            }),
            (o.prototype.imuln = function (t) {
              i('number' == typeof t), i(t < 67108864)
              for (var e = 0, r = 0; r < this.length; r++) {
                var n = (0 | this.words[r]) * t,
                  o = (67108863 & n) + (67108863 & e)
                ;(e >>= 26),
                  (e += (n / 67108864) | 0),
                  (e += o >>> 26),
                  (this.words[r] = 67108863 & o)
              }
              return 0 !== e && ((this.words[r] = e), this.length++), this
            }),
            (o.prototype.muln = function (t) {
              return this.clone().imuln(t)
            }),
            (o.prototype.sqr = function () {
              return this.mul(this)
            }),
            (o.prototype.isqr = function () {
              return this.imul(this.clone())
            }),
            (o.prototype.pow = function (t) {
              var e = (function (t) {
                for (
                  var e = new Array(t.bitLength()), r = 0;
                  r < e.length;
                  r++
                ) {
                  var i = (r / 26) | 0,
                    n = r % 26
                  e[r] = (t.words[i] & (1 << n)) >>> n
                }
                return e
              })(t)
              if (0 === e.length) return new o(1)
              for (
                var r = this, i = 0;
                i < e.length && 0 === e[i];
                i++, r = r.sqr()
              );
              if (++i < e.length)
                for (var n = r.sqr(); i < e.length; i++, n = n.sqr())
                  0 !== e[i] && (r = r.mul(n))
              return r
            }),
            (o.prototype.iushln = function (t) {
              i('number' == typeof t && t >= 0)
              var e,
                r = t % 26,
                n = (t - r) / 26,
                o = (67108863 >>> (26 - r)) << (26 - r)
              if (0 !== r) {
                var s = 0
                for (e = 0; e < this.length; e++) {
                  var h = this.words[e] & o,
                    u = ((0 | this.words[e]) - h) << r
                  ;(this.words[e] = u | s), (s = h >>> (26 - r))
                }
                s && ((this.words[e] = s), this.length++)
              }
              if (0 !== n) {
                for (e = this.length - 1; e >= 0; e--)
                  this.words[e + n] = this.words[e]
                for (e = 0; e < n; e++) this.words[e] = 0
                this.length += n
              }
              return this.strip()
            }),
            (o.prototype.ishln = function (t) {
              return i(0 === this.negative), this.iushln(t)
            }),
            (o.prototype.iushrn = function (t, e, r) {
              var n
              i('number' == typeof t && t >= 0),
                (n = e ? (e - (e % 26)) / 26 : 0)
              var o = t % 26,
                s = Math.min((t - o) / 26, this.length),
                h = 67108863 ^ ((67108863 >>> o) << o),
                u = r
              if (((n -= s), (n = Math.max(0, n)), u)) {
                for (var a = 0; a < s; a++) u.words[a] = this.words[a]
                u.length = s
              }
              if (0 === s);
              else if (this.length > s)
                for (this.length -= s, a = 0; a < this.length; a++)
                  this.words[a] = this.words[a + s]
              else (this.words[0] = 0), (this.length = 1)
              var f = 0
              for (a = this.length - 1; a >= 0 && (0 !== f || a >= n); a--) {
                var l = 0 | this.words[a]
                ;(this.words[a] = (f << (26 - o)) | (l >>> o)), (f = l & h)
              }
              return (
                u && 0 !== f && (u.words[u.length++] = f),
                0 === this.length && ((this.words[0] = 0), (this.length = 1)),
                this.strip()
              )
            }),
            (o.prototype.ishrn = function (t, e, r) {
              return i(0 === this.negative), this.iushrn(t, e, r)
            }),
            (o.prototype.shln = function (t) {
              return this.clone().ishln(t)
            }),
            (o.prototype.ushln = function (t) {
              return this.clone().iushln(t)
            }),
            (o.prototype.shrn = function (t) {
              return this.clone().ishrn(t)
            }),
            (o.prototype.ushrn = function (t) {
              return this.clone().iushrn(t)
            }),
            (o.prototype.testn = function (t) {
              i('number' == typeof t && t >= 0)
              var e = t % 26,
                r = (t - e) / 26,
                n = 1 << e
              return !(this.length <= r || !(this.words[r] & n))
            }),
            (o.prototype.imaskn = function (t) {
              i('number' == typeof t && t >= 0)
              var e = t % 26,
                r = (t - e) / 26
              if (
                (i(
                  0 === this.negative,
                  'imaskn works only with positive numbers'
                ),
                this.length <= r)
              )
                return this
              if (
                (0 !== e && r++,
                (this.length = Math.min(r, this.length)),
                0 !== e)
              ) {
                var n = 67108863 ^ ((67108863 >>> e) << e)
                this.words[this.length - 1] &= n
              }
              return this.strip()
            }),
            (o.prototype.maskn = function (t) {
              return this.clone().imaskn(t)
            }),
            (o.prototype.iaddn = function (t) {
              return (
                i('number' == typeof t),
                i(t < 67108864),
                t < 0
                  ? this.isubn(-t)
                  : 0 !== this.negative
                  ? 1 === this.length && (0 | this.words[0]) < t
                    ? ((this.words[0] = t - (0 | this.words[0])),
                      (this.negative = 0),
                      this)
                    : ((this.negative = 0),
                      this.isubn(t),
                      (this.negative = 1),
                      this)
                  : this._iaddn(t)
              )
            }),
            (o.prototype._iaddn = function (t) {
              this.words[0] += t
              for (var e = 0; e < this.length && this.words[e] >= 67108864; e++)
                (this.words[e] -= 67108864),
                  e === this.length - 1
                    ? (this.words[e + 1] = 1)
                    : this.words[e + 1]++
              return (this.length = Math.max(this.length, e + 1)), this
            }),
            (o.prototype.isubn = function (t) {
              if ((i('number' == typeof t), i(t < 67108864), t < 0))
                return this.iaddn(-t)
              if (0 !== this.negative)
                return (
                  (this.negative = 0), this.iaddn(t), (this.negative = 1), this
                )
              if (
                ((this.words[0] -= t), 1 === this.length && this.words[0] < 0)
              )
                (this.words[0] = -this.words[0]), (this.negative = 1)
              else
                for (var e = 0; e < this.length && this.words[e] < 0; e++)
                  (this.words[e] += 67108864), (this.words[e + 1] -= 1)
              return this.strip()
            }),
            (o.prototype.addn = function (t) {
              return this.clone().iaddn(t)
            }),
            (o.prototype.subn = function (t) {
              return this.clone().isubn(t)
            }),
            (o.prototype.iabs = function () {
              return (this.negative = 0), this
            }),
            (o.prototype.abs = function () {
              return this.clone().iabs()
            }),
            (o.prototype._ishlnsubmul = function (t, e, r) {
              var n,
                o,
                s = t.length + r
              this._expand(s)
              var h = 0
              for (n = 0; n < t.length; n++) {
                o = (0 | this.words[n + r]) + h
                var u = (0 | t.words[n]) * e
                ;(h = ((o -= 67108863 & u) >> 26) - ((u / 67108864) | 0)),
                  (this.words[n + r] = 67108863 & o)
              }
              for (; n < this.length - r; n++)
                (h = (o = (0 | this.words[n + r]) + h) >> 26),
                  (this.words[n + r] = 67108863 & o)
              if (0 === h) return this.strip()
              for (i(-1 === h), h = 0, n = 0; n < this.length; n++)
                (h = (o = -(0 | this.words[n]) + h) >> 26),
                  (this.words[n] = 67108863 & o)
              return (this.negative = 1), this.strip()
            }),
            (o.prototype._wordDiv = function (t, e) {
              var r = (this.length, t.length),
                i = this.clone(),
                n = t,
                s = 0 | n.words[n.length - 1]
              0 != (r = 26 - this._countBits(s)) &&
                ((n = n.ushln(r)), i.iushln(r), (s = 0 | n.words[n.length - 1]))
              var h,
                u = i.length - n.length
              if ('mod' !== e) {
                ;((h = new o(null)).length = u + 1),
                  (h.words = new Array(h.length))
                for (var a = 0; a < h.length; a++) h.words[a] = 0
              }
              var f = i.clone()._ishlnsubmul(n, 1, u)
              0 === f.negative && ((i = f), h && (h.words[u] = 1))
              for (var l = u - 1; l >= 0; l--) {
                var c =
                  67108864 * (0 | i.words[n.length + l]) +
                  (0 | i.words[n.length + l - 1])
                for (
                  c = Math.min((c / s) | 0, 67108863), i._ishlnsubmul(n, c, l);
                  0 !== i.negative;

                )
                  c--,
                    (i.negative = 0),
                    i._ishlnsubmul(n, 1, l),
                    i.isZero() || (i.negative ^= 1)
                h && (h.words[l] = c)
              }
              return (
                h && h.strip(),
                i.strip(),
                'div' !== e && 0 !== r && i.iushrn(r),
                { div: h || null, mod: i }
              )
            }),
            (o.prototype.divmod = function (t, e, r) {
              return (
                i(!t.isZero()),
                this.isZero()
                  ? { div: new o(0), mod: new o(0) }
                  : 0 !== this.negative && 0 === t.negative
                  ? ((h = this.neg().divmod(t, e)),
                    'mod' !== e && (n = h.div.neg()),
                    'div' !== e &&
                      ((s = h.mod.neg()), r && 0 !== s.negative && s.iadd(t)),
                    { div: n, mod: s })
                  : 0 === this.negative && 0 !== t.negative
                  ? ((h = this.divmod(t.neg(), e)),
                    'mod' !== e && (n = h.div.neg()),
                    { div: n, mod: h.mod })
                  : 0 != (this.negative & t.negative)
                  ? ((h = this.neg().divmod(t.neg(), e)),
                    'div' !== e &&
                      ((s = h.mod.neg()), r && 0 !== s.negative && s.isub(t)),
                    { div: h.div, mod: s })
                  : t.length > this.length || this.cmp(t) < 0
                  ? { div: new o(0), mod: this }
                  : 1 === t.length
                  ? 'div' === e
                    ? { div: this.divn(t.words[0]), mod: null }
                    : 'mod' === e
                    ? { div: null, mod: new o(this.modn(t.words[0])) }
                    : {
                        div: this.divn(t.words[0]),
                        mod: new o(this.modn(t.words[0]))
                      }
                  : this._wordDiv(t, e)
              )
              var n, s, h
            }),
            (o.prototype.div = function (t) {
              return this.divmod(t, 'div', !1).div
            }),
            (o.prototype.mod = function (t) {
              return this.divmod(t, 'mod', !1).mod
            }),
            (o.prototype.umod = function (t) {
              return this.divmod(t, 'mod', !0).mod
            }),
            (o.prototype.divRound = function (t) {
              var e = this.divmod(t)
              if (e.mod.isZero()) return e.div
              var r = 0 !== e.div.negative ? e.mod.isub(t) : e.mod,
                i = t.ushrn(1),
                n = t.andln(1),
                o = r.cmp(i)
              return o < 0 || (1 === n && 0 === o)
                ? e.div
                : 0 !== e.div.negative
                ? e.div.isubn(1)
                : e.div.iaddn(1)
            }),
            (o.prototype.modn = function (t) {
              i(t <= 67108863)
              for (
                var e = (1 << 26) % t, r = 0, n = this.length - 1;
                n >= 0;
                n--
              )
                r = (e * r + (0 | this.words[n])) % t
              return r
            }),
            (o.prototype.idivn = function (t) {
              i(t <= 67108863)
              for (var e = 0, r = this.length - 1; r >= 0; r--) {
                var n = (0 | this.words[r]) + 67108864 * e
                ;(this.words[r] = (n / t) | 0), (e = n % t)
              }
              return this.strip()
            }),
            (o.prototype.divn = function (t) {
              return this.clone().idivn(t)
            }),
            (o.prototype.egcd = function (t) {
              i(0 === t.negative), i(!t.isZero())
              var e = this,
                r = t.clone()
              e = 0 !== e.negative ? e.umod(t) : e.clone()
              for (
                var n = new o(1),
                  s = new o(0),
                  h = new o(0),
                  u = new o(1),
                  a = 0;
                e.isEven() && r.isEven();

              )
                e.iushrn(1), r.iushrn(1), ++a
              for (var f = r.clone(), l = e.clone(); !e.isZero(); ) {
                for (
                  var c = 0, p = 1;
                  0 == (e.words[0] & p) && c < 26;
                  ++c, p <<= 1
                );
                if (c > 0)
                  for (e.iushrn(c); c-- > 0; )
                    (n.isOdd() || s.isOdd()) && (n.iadd(f), s.isub(l)),
                      n.iushrn(1),
                      s.iushrn(1)
                for (
                  var d = 0, m = 1;
                  0 == (r.words[0] & m) && d < 26;
                  ++d, m <<= 1
                );
                if (d > 0)
                  for (r.iushrn(d); d-- > 0; )
                    (h.isOdd() || u.isOdd()) && (h.iadd(f), u.isub(l)),
                      h.iushrn(1),
                      u.iushrn(1)
                e.cmp(r) >= 0
                  ? (e.isub(r), n.isub(h), s.isub(u))
                  : (r.isub(e), h.isub(n), u.isub(s))
              }
              return { a: h, b: u, gcd: r.iushln(a) }
            }),
            (o.prototype._invmp = function (t) {
              i(0 === t.negative), i(!t.isZero())
              var e = this,
                r = t.clone()
              e = 0 !== e.negative ? e.umod(t) : e.clone()
              for (
                var n, s = new o(1), h = new o(0), u = r.clone();
                e.cmpn(1) > 0 && r.cmpn(1) > 0;

              ) {
                for (
                  var a = 0, f = 1;
                  0 == (e.words[0] & f) && a < 26;
                  ++a, f <<= 1
                );
                if (a > 0)
                  for (e.iushrn(a); a-- > 0; )
                    s.isOdd() && s.iadd(u), s.iushrn(1)
                for (
                  var l = 0, c = 1;
                  0 == (r.words[0] & c) && l < 26;
                  ++l, c <<= 1
                );
                if (l > 0)
                  for (r.iushrn(l); l-- > 0; )
                    h.isOdd() && h.iadd(u), h.iushrn(1)
                e.cmp(r) >= 0 ? (e.isub(r), s.isub(h)) : (r.isub(e), h.isub(s))
              }
              return (n = 0 === e.cmpn(1) ? s : h).cmpn(0) < 0 && n.iadd(t), n
            }),
            (o.prototype.gcd = function (t) {
              if (this.isZero()) return t.abs()
              if (t.isZero()) return this.abs()
              var e = this.clone(),
                r = t.clone()
              ;(e.negative = 0), (r.negative = 0)
              for (var i = 0; e.isEven() && r.isEven(); i++)
                e.iushrn(1), r.iushrn(1)
              for (;;) {
                for (; e.isEven(); ) e.iushrn(1)
                for (; r.isEven(); ) r.iushrn(1)
                var n = e.cmp(r)
                if (n < 0) {
                  var o = e
                  ;(e = r), (r = o)
                } else if (0 === n || 0 === r.cmpn(1)) break
                e.isub(r)
              }
              return r.iushln(i)
            }),
            (o.prototype.invm = function (t) {
              return this.egcd(t).a.umod(t)
            }),
            (o.prototype.isEven = function () {
              return 0 == (1 & this.words[0])
            }),
            (o.prototype.isOdd = function () {
              return 1 == (1 & this.words[0])
            }),
            (o.prototype.andln = function (t) {
              return this.words[0] & t
            }),
            (o.prototype.bincn = function (t) {
              i('number' == typeof t)
              var e = t % 26,
                r = (t - e) / 26,
                n = 1 << e
              if (this.length <= r)
                return this._expand(r + 1), (this.words[r] |= n), this
              for (var o = n, s = r; 0 !== o && s < this.length; s++) {
                var h = 0 | this.words[s]
                ;(o = (h += o) >>> 26), (h &= 67108863), (this.words[s] = h)
              }
              return 0 !== o && ((this.words[s] = o), this.length++), this
            }),
            (o.prototype.isZero = function () {
              return 1 === this.length && 0 === this.words[0]
            }),
            (o.prototype.cmpn = function (t) {
              var e,
                r = t < 0
              if (0 !== this.negative && !r) return -1
              if (0 === this.negative && r) return 1
              if ((this.strip(), this.length > 1)) e = 1
              else {
                r && (t = -t), i(t <= 67108863, 'Number is too big')
                var n = 0 | this.words[0]
                e = n === t ? 0 : n < t ? -1 : 1
              }
              return 0 !== this.negative ? 0 | -e : e
            }),
            (o.prototype.cmp = function (t) {
              if (0 !== this.negative && 0 === t.negative) return -1
              if (0 === this.negative && 0 !== t.negative) return 1
              var e = this.ucmp(t)
              return 0 !== this.negative ? 0 | -e : e
            }),
            (o.prototype.ucmp = function (t) {
              if (this.length > t.length) return 1
              if (this.length < t.length) return -1
              for (var e = 0, r = this.length - 1; r >= 0; r--) {
                var i = 0 | this.words[r],
                  n = 0 | t.words[r]
                if (i !== n) {
                  i < n ? (e = -1) : i > n && (e = 1)
                  break
                }
              }
              return e
            }),
            (o.prototype.gtn = function (t) {
              return 1 === this.cmpn(t)
            }),
            (o.prototype.gt = function (t) {
              return 1 === this.cmp(t)
            }),
            (o.prototype.gten = function (t) {
              return this.cmpn(t) >= 0
            }),
            (o.prototype.gte = function (t) {
              return this.cmp(t) >= 0
            }),
            (o.prototype.ltn = function (t) {
              return -1 === this.cmpn(t)
            }),
            (o.prototype.lt = function (t) {
              return -1 === this.cmp(t)
            }),
            (o.prototype.lten = function (t) {
              return this.cmpn(t) <= 0
            }),
            (o.prototype.lte = function (t) {
              return this.cmp(t) <= 0
            }),
            (o.prototype.eqn = function (t) {
              return 0 === this.cmpn(t)
            }),
            (o.prototype.eq = function (t) {
              return 0 === this.cmp(t)
            }),
            (o.red = function (t) {
              return new A(t)
            }),
            (o.prototype.toRed = function (t) {
              return (
                i(!this.red, 'Already a number in reduction context'),
                i(0 === this.negative, 'red works only with positives'),
                t.convertTo(this)._forceRed(t)
              )
            }),
            (o.prototype.fromRed = function () {
              return (
                i(
                  this.red,
                  'fromRed works only with numbers in reduction context'
                ),
                this.red.convertFrom(this)
              )
            }),
            (o.prototype._forceRed = function (t) {
              return (this.red = t), this
            }),
            (o.prototype.forceRed = function (t) {
              return (
                i(!this.red, 'Already a number in reduction context'),
                this._forceRed(t)
              )
            }),
            (o.prototype.redAdd = function (t) {
              return (
                i(this.red, 'redAdd works only with red numbers'),
                this.red.add(this, t)
              )
            }),
            (o.prototype.redIAdd = function (t) {
              return (
                i(this.red, 'redIAdd works only with red numbers'),
                this.red.iadd(this, t)
              )
            }),
            (o.prototype.redSub = function (t) {
              return (
                i(this.red, 'redSub works only with red numbers'),
                this.red.sub(this, t)
              )
            }),
            (o.prototype.redISub = function (t) {
              return (
                i(this.red, 'redISub works only with red numbers'),
                this.red.isub(this, t)
              )
            }),
            (o.prototype.redShl = function (t) {
              return (
                i(this.red, 'redShl works only with red numbers'),
                this.red.shl(this, t)
              )
            }),
            (o.prototype.redMul = function (t) {
              return (
                i(this.red, 'redMul works only with red numbers'),
                this.red._verify2(this, t),
                this.red.mul(this, t)
              )
            }),
            (o.prototype.redIMul = function (t) {
              return (
                i(this.red, 'redMul works only with red numbers'),
                this.red._verify2(this, t),
                this.red.imul(this, t)
              )
            }),
            (o.prototype.redSqr = function () {
              return (
                i(this.red, 'redSqr works only with red numbers'),
                this.red._verify1(this),
                this.red.sqr(this)
              )
            }),
            (o.prototype.redISqr = function () {
              return (
                i(this.red, 'redISqr works only with red numbers'),
                this.red._verify1(this),
                this.red.isqr(this)
              )
            }),
            (o.prototype.redSqrt = function () {
              return (
                i(this.red, 'redSqrt works only with red numbers'),
                this.red._verify1(this),
                this.red.sqrt(this)
              )
            }),
            (o.prototype.redInvm = function () {
              return (
                i(this.red, 'redInvm works only with red numbers'),
                this.red._verify1(this),
                this.red.invm(this)
              )
            }),
            (o.prototype.redNeg = function () {
              return (
                i(this.red, 'redNeg works only with red numbers'),
                this.red._verify1(this),
                this.red.neg(this)
              )
            }),
            (o.prototype.redPow = function (t) {
              return (
                i(this.red && !t.red, 'redPow(normalNum)'),
                this.red._verify1(this),
                this.red.pow(this, t)
              )
            })
          var y = { k256: null, p224: null, p192: null, p25519: null }
          function w(t, e) {
            ;(this.name = t),
              (this.p = new o(e, 16)),
              (this.n = this.p.bitLength()),
              (this.k = new o(1).iushln(this.n).isub(this.p)),
              (this.tmp = this._tmp())
          }
          function v() {
            w.call(
              this,
              'k256',
              'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f'
            )
          }
          function M() {
            w.call(
              this,
              'p224',
              'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001'
            )
          }
          function b() {
            w.call(
              this,
              'p192',
              'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff'
            )
          }
          function B() {
            w.call(
              this,
              '25519',
              '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed'
            )
          }
          function A(t) {
            if ('string' == typeof t) {
              var e = o._prime(t)
              ;(this.m = e.p), (this.prime = e)
            } else
              i(t.gtn(1), 'modulus must be greater than 1'),
                (this.m = t),
                (this.prime = null)
          }
          function E(t) {
            A.call(this, t),
              (this.shift = this.m.bitLength()),
              this.shift % 26 != 0 && (this.shift += 26 - (this.shift % 26)),
              (this.r = new o(1).iushln(this.shift)),
              (this.r2 = this.imod(this.r.sqr())),
              (this.rinv = this.r._invmp(this.m)),
              (this.minv = this.rinv.mul(this.r).isubn(1).div(this.m)),
              (this.minv = this.minv.umod(this.r)),
              (this.minv = this.r.sub(this.minv))
          }
          ;(w.prototype._tmp = function () {
            var t = new o(null)
            return (t.words = new Array(Math.ceil(this.n / 13))), t
          }),
            (w.prototype.ireduce = function (t) {
              var e,
                r = t
              do {
                this.split(r, this.tmp),
                  (e = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength())
              } while (e > this.n)
              var i = e < this.n ? -1 : r.ucmp(this.p)
              return (
                0 === i
                  ? ((r.words[0] = 0), (r.length = 1))
                  : i > 0
                  ? r.isub(this.p)
                  : void 0 !== r.strip
                  ? r.strip()
                  : r._strip(),
                r
              )
            }),
            (w.prototype.split = function (t, e) {
              t.iushrn(this.n, 0, e)
            }),
            (w.prototype.imulK = function (t) {
              return t.imul(this.k)
            }),
            n(v, w),
            (v.prototype.split = function (t, e) {
              for (
                var r = 4194303, i = Math.min(t.length, 9), n = 0;
                n < i;
                n++
              )
                e.words[n] = t.words[n]
              if (((e.length = i), t.length <= 9))
                return (t.words[0] = 0), void (t.length = 1)
              var o = t.words[9]
              for (e.words[e.length++] = o & r, n = 10; n < t.length; n++) {
                var s = 0 | t.words[n]
                ;(t.words[n - 10] = ((s & r) << 4) | (o >>> 22)), (o = s)
              }
              ;(o >>>= 22),
                (t.words[n - 10] = o),
                0 === o && t.length > 10 ? (t.length -= 10) : (t.length -= 9)
            }),
            (v.prototype.imulK = function (t) {
              ;(t.words[t.length] = 0),
                (t.words[t.length + 1] = 0),
                (t.length += 2)
              for (var e = 0, r = 0; r < t.length; r++) {
                var i = 0 | t.words[r]
                ;(e += 977 * i),
                  (t.words[r] = 67108863 & e),
                  (e = 64 * i + ((e / 67108864) | 0))
              }
              return (
                0 === t.words[t.length - 1] &&
                  (t.length--, 0 === t.words[t.length - 1] && t.length--),
                t
              )
            }),
            n(M, w),
            n(b, w),
            n(B, w),
            (B.prototype.imulK = function (t) {
              for (var e = 0, r = 0; r < t.length; r++) {
                var i = 19 * (0 | t.words[r]) + e,
                  n = 67108863 & i
                ;(i >>>= 26), (t.words[r] = n), (e = i)
              }
              return 0 !== e && (t.words[t.length++] = e), t
            }),
            (o._prime = function (t) {
              if (y[t]) return y[t]
              var e
              if ('k256' === t) e = new v()
              else if ('p224' === t) e = new M()
              else if ('p192' === t) e = new b()
              else {
                if ('p25519' !== t) throw new Error('Unknown prime ' + t)
                e = new B()
              }
              return (y[t] = e), e
            }),
            (A.prototype._verify1 = function (t) {
              i(0 === t.negative, 'red works only with positives'),
                i(t.red, 'red works only with red numbers')
            }),
            (A.prototype._verify2 = function (t, e) {
              i(
                0 == (t.negative | e.negative),
                'red works only with positives'
              ),
                i(t.red && t.red === e.red, 'red works only with red numbers')
            }),
            (A.prototype.imod = function (t) {
              return this.prime
                ? this.prime.ireduce(t)._forceRed(this)
                : t.umod(this.m)._forceRed(this)
            }),
            (A.prototype.neg = function (t) {
              return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this)
            }),
            (A.prototype.add = function (t, e) {
              this._verify2(t, e)
              var r = t.add(e)
              return r.cmp(this.m) >= 0 && r.isub(this.m), r._forceRed(this)
            }),
            (A.prototype.iadd = function (t, e) {
              this._verify2(t, e)
              var r = t.iadd(e)
              return r.cmp(this.m) >= 0 && r.isub(this.m), r
            }),
            (A.prototype.sub = function (t, e) {
              this._verify2(t, e)
              var r = t.sub(e)
              return r.cmpn(0) < 0 && r.iadd(this.m), r._forceRed(this)
            }),
            (A.prototype.isub = function (t, e) {
              this._verify2(t, e)
              var r = t.isub(e)
              return r.cmpn(0) < 0 && r.iadd(this.m), r
            }),
            (A.prototype.shl = function (t, e) {
              return this._verify1(t), this.imod(t.ushln(e))
            }),
            (A.prototype.imul = function (t, e) {
              return this._verify2(t, e), this.imod(t.imul(e))
            }),
            (A.prototype.mul = function (t, e) {
              return this._verify2(t, e), this.imod(t.mul(e))
            }),
            (A.prototype.isqr = function (t) {
              return this.imul(t, t.clone())
            }),
            (A.prototype.sqr = function (t) {
              return this.mul(t, t)
            }),
            (A.prototype.sqrt = function (t) {
              if (t.isZero()) return t.clone()
              var e = this.m.andln(3)
              if ((i(e % 2 == 1), 3 === e)) {
                var r = this.m.add(new o(1)).iushrn(2)
                return this.pow(t, r)
              }
              for (
                var n = this.m.subn(1), s = 0;
                !n.isZero() && 0 === n.andln(1);

              )
                s++, n.iushrn(1)
              i(!n.isZero())
              var h = new o(1).toRed(this),
                u = h.redNeg(),
                a = this.m.subn(1).iushrn(1),
                f = this.m.bitLength()
              for (
                f = new o(2 * f * f).toRed(this);
                0 !== this.pow(f, a).cmp(u);

              )
                f.redIAdd(u)
              for (
                var l = this.pow(f, n),
                  c = this.pow(t, n.addn(1).iushrn(1)),
                  p = this.pow(t, n),
                  d = s;
                0 !== p.cmp(h);

              ) {
                for (var m = p, g = 0; 0 !== m.cmp(h); g++) m = m.redSqr()
                i(g < d)
                var y = this.pow(l, new o(1).iushln(d - g - 1))
                ;(c = c.redMul(y)), (l = y.redSqr()), (p = p.redMul(l)), (d = g)
              }
              return c
            }),
            (A.prototype.invm = function (t) {
              var e = t._invmp(this.m)
              return 0 !== e.negative
                ? ((e.negative = 0), this.imod(e).redNeg())
                : this.imod(e)
            }),
            (A.prototype.pow = function (t, e) {
              if (e.isZero()) return new o(1).toRed(this)
              if (0 === e.cmpn(1)) return t.clone()
              var r = new Array(16)
              ;(r[0] = new o(1).toRed(this)), (r[1] = t)
              for (var i = 2; i < r.length; i++) r[i] = this.mul(r[i - 1], t)
              var n = r[0],
                s = 0,
                h = 0,
                u = e.bitLength() % 26
              for (0 === u && (u = 26), i = e.length - 1; i >= 0; i--) {
                for (var a = e.words[i], f = u - 1; f >= 0; f--) {
                  var l = (a >> f) & 1
                  n !== r[0] && (n = this.sqr(n)),
                    0 !== l || 0 !== s
                      ? ((s <<= 1),
                        (s |= l),
                        (4 == ++h || (0 === i && 0 === f)) &&
                          ((n = this.mul(n, r[s])), (h = 0), (s = 0)))
                      : (h = 0)
                }
                u = 26
              }
              return n
            }),
            (A.prototype.convertTo = function (t) {
              var e = t.umod(this.m)
              return e === t ? e.clone() : e
            }),
            (A.prototype.convertFrom = function (t) {
              var e = t.clone()
              return (e.red = null), e
            }),
            (o.mont = function (t) {
              return new E(t)
            }),
            n(E, A),
            (E.prototype.convertTo = function (t) {
              return this.imod(t.ushln(this.shift))
            }),
            (E.prototype.convertFrom = function (t) {
              var e = this.imod(t.mul(this.rinv))
              return (e.red = null), e
            }),
            (E.prototype.imul = function (t, e) {
              if (t.isZero() || e.isZero())
                return (t.words[0] = 0), (t.length = 1), t
              var r = t.imul(e),
                i = r
                  .maskn(this.shift)
                  .mul(this.minv)
                  .imaskn(this.shift)
                  .mul(this.m),
                n = r.isub(i).iushrn(this.shift),
                o = n
              return (
                n.cmp(this.m) >= 0
                  ? (o = n.isub(this.m))
                  : n.cmpn(0) < 0 && (o = n.iadd(this.m)),
                o._forceRed(this)
              )
            }),
            (E.prototype.mul = function (t, e) {
              if (t.isZero() || e.isZero()) return new o(0)._forceRed(this)
              var r = t.mul(e),
                i = r
                  .maskn(this.shift)
                  .mul(this.minv)
                  .imaskn(this.shift)
                  .mul(this.m),
                n = r.isub(i).iushrn(this.shift),
                s = n
              return (
                n.cmp(this.m) >= 0
                  ? (s = n.isub(this.m))
                  : n.cmpn(0) < 0 && (s = n.iadd(this.m)),
                s._forceRed(this)
              )
            }),
            (E.prototype.invm = function (t) {
              return this.imod(t._invmp(this.m).mul(this.r2))._forceRed(this)
            })
        })((t = r.nmd(t)), this)
      },
      834: (t, e, r) => {
        'use strict'
        const i = r(766),
          n = r(333),
          o =
            'function' == typeof Symbol && 'function' == typeof Symbol.for
              ? Symbol.for('nodejs.util.inspect.custom')
              : null
        ;(e.Buffer = u),
          (e.SlowBuffer = function (t) {
            return +t != t && (t = 0), u.alloc(+t)
          }),
          (e.INSPECT_MAX_BYTES = 50)
        const s = 2147483647
        function h(t) {
          if (t > s)
            throw new RangeError(
              'The value "' + t + '" is invalid for option "size"'
            )
          const e = new Uint8Array(t)
          return Object.setPrototypeOf(e, u.prototype), e
        }
        function u(t, e, r) {
          if ('number' == typeof t) {
            if ('string' == typeof e)
              throw new TypeError(
                'The "string" argument must be of type string. Received type number'
              )
            return l(t)
          }
          return a(t, e, r)
        }
        function a(t, e, r) {
          if ('string' == typeof t)
            return (function (t, e) {
              if (
                (('string' == typeof e && '' !== e) || (e = 'utf8'),
                !u.isEncoding(e))
              )
                throw new TypeError('Unknown encoding: ' + e)
              const r = 0 | m(t, e)
              let i = h(r)
              const n = i.write(t, e)
              return n !== r && (i = i.slice(0, n)), i
            })(t, e)
          if (ArrayBuffer.isView(t))
            return (function (t) {
              if (X(t, Uint8Array)) {
                const e = new Uint8Array(t)
                return p(e.buffer, e.byteOffset, e.byteLength)
              }
              return c(t)
            })(t)
          if (null == t)
            throw new TypeError(
              'The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type ' +
                typeof t
            )
          if (X(t, ArrayBuffer) || (t && X(t.buffer, ArrayBuffer)))
            return p(t, e, r)
          if (
            'undefined' != typeof SharedArrayBuffer &&
            (X(t, SharedArrayBuffer) || (t && X(t.buffer, SharedArrayBuffer)))
          )
            return p(t, e, r)
          if ('number' == typeof t)
            throw new TypeError(
              'The "value" argument must not be of type number. Received type number'
            )
          const i = t.valueOf && t.valueOf()
          if (null != i && i !== t) return u.from(i, e, r)
          const n = (function (t) {
            if (u.isBuffer(t)) {
              const e = 0 | d(t.length),
                r = h(e)
              return 0 === r.length || t.copy(r, 0, 0, e), r
            }
            return void 0 !== t.length
              ? 'number' != typeof t.length || K(t.length)
                ? h(0)
                : c(t)
              : 'Buffer' === t.type && Array.isArray(t.data)
              ? c(t.data)
              : void 0
          })(t)
          if (n) return n
          if (
            'undefined' != typeof Symbol &&
            null != Symbol.toPrimitive &&
            'function' == typeof t[Symbol.toPrimitive]
          )
            return u.from(t[Symbol.toPrimitive]('string'), e, r)
          throw new TypeError(
            'The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type ' +
              typeof t
          )
        }
        function f(t) {
          if ('number' != typeof t)
            throw new TypeError('"size" argument must be of type number')
          if (t < 0)
            throw new RangeError(
              'The value "' + t + '" is invalid for option "size"'
            )
        }
        function l(t) {
          return f(t), h(t < 0 ? 0 : 0 | d(t))
        }
        function c(t) {
          const e = t.length < 0 ? 0 : 0 | d(t.length),
            r = h(e)
          for (let i = 0; i < e; i += 1) r[i] = 255 & t[i]
          return r
        }
        function p(t, e, r) {
          if (e < 0 || t.byteLength < e)
            throw new RangeError('"offset" is outside of buffer bounds')
          if (t.byteLength < e + (r || 0))
            throw new RangeError('"length" is outside of buffer bounds')
          let i
          return (
            (i =
              void 0 === e && void 0 === r
                ? new Uint8Array(t)
                : void 0 === r
                ? new Uint8Array(t, e)
                : new Uint8Array(t, e, r)),
            Object.setPrototypeOf(i, u.prototype),
            i
          )
        }
        function d(t) {
          if (t >= s)
            throw new RangeError(
              'Attempt to allocate Buffer larger than maximum size: 0x' +
                s.toString(16) +
                ' bytes'
            )
          return 0 | t
        }
        function m(t, e) {
          if (u.isBuffer(t)) return t.length
          if (ArrayBuffer.isView(t) || X(t, ArrayBuffer)) return t.byteLength
          if ('string' != typeof t)
            throw new TypeError(
              'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' +
                typeof t
            )
          const r = t.length,
            i = arguments.length > 2 && !0 === arguments[2]
          if (!i && 0 === r) return 0
          let n = !1
          for (;;)
            switch (e) {
              case 'ascii':
              case 'latin1':
              case 'binary':
                return r
              case 'utf8':
              case 'utf-8':
                return Y(t).length
              case 'ucs2':
              case 'ucs-2':
              case 'utf16le':
              case 'utf-16le':
                return 2 * r
              case 'hex':
                return r >>> 1
              case 'base64':
                return G(t).length
              default:
                if (n) return i ? -1 : Y(t).length
                ;(e = ('' + e).toLowerCase()), (n = !0)
            }
        }
        function g(t, e, r) {
          let i = !1
          if (((void 0 === e || e < 0) && (e = 0), e > this.length)) return ''
          if (((void 0 === r || r > this.length) && (r = this.length), r <= 0))
            return ''
          if ((r >>>= 0) <= (e >>>= 0)) return ''
          for (t || (t = 'utf8'); ; )
            switch (t) {
              case 'hex':
                return T(this, e, r)
              case 'utf8':
              case 'utf-8':
                return I(this, e, r)
              case 'ascii':
                return x(this, e, r)
              case 'latin1':
              case 'binary':
                return R(this, e, r)
              case 'base64':
                return _(this, e, r)
              case 'ucs2':
              case 'ucs-2':
              case 'utf16le':
              case 'utf-16le':
                return S(this, e, r)
              default:
                if (i) throw new TypeError('Unknown encoding: ' + t)
                ;(t = (t + '').toLowerCase()), (i = !0)
            }
        }
        function y(t, e, r) {
          const i = t[e]
          ;(t[e] = t[r]), (t[r] = i)
        }
        function w(t, e, r, i, n) {
          if (0 === t.length) return -1
          if (
            ('string' == typeof r
              ? ((i = r), (r = 0))
              : r > 2147483647
              ? (r = 2147483647)
              : r < -2147483648 && (r = -2147483648),
            K((r = +r)) && (r = n ? 0 : t.length - 1),
            r < 0 && (r = t.length + r),
            r >= t.length)
          ) {
            if (n) return -1
            r = t.length - 1
          } else if (r < 0) {
            if (!n) return -1
            r = 0
          }
          if (('string' == typeof e && (e = u.from(e, i)), u.isBuffer(e)))
            return 0 === e.length ? -1 : v(t, e, r, i, n)
          if ('number' == typeof e)
            return (
              (e &= 255),
              'function' == typeof Uint8Array.prototype.indexOf
                ? n
                  ? Uint8Array.prototype.indexOf.call(t, e, r)
                  : Uint8Array.prototype.lastIndexOf.call(t, e, r)
                : v(t, [e], r, i, n)
            )
          throw new TypeError('val must be string, number or Buffer')
        }
        function v(t, e, r, i, n) {
          let o,
            s = 1,
            h = t.length,
            u = e.length
          if (
            void 0 !== i &&
            ('ucs2' === (i = String(i).toLowerCase()) ||
              'ucs-2' === i ||
              'utf16le' === i ||
              'utf-16le' === i)
          ) {
            if (t.length < 2 || e.length < 2) return -1
            ;(s = 2), (h /= 2), (u /= 2), (r /= 2)
          }
          function a(t, e) {
            return 1 === s ? t[e] : t.readUInt16BE(e * s)
          }
          if (n) {
            let i = -1
            for (o = r; o < h; o++)
              if (a(t, o) === a(e, -1 === i ? 0 : o - i)) {
                if ((-1 === i && (i = o), o - i + 1 === u)) return i * s
              } else -1 !== i && (o -= o - i), (i = -1)
          } else
            for (r + u > h && (r = h - u), o = r; o >= 0; o--) {
              let r = !0
              for (let i = 0; i < u; i++)
                if (a(t, o + i) !== a(e, i)) {
                  r = !1
                  break
                }
              if (r) return o
            }
          return -1
        }
        function M(t, e, r, i) {
          r = Number(r) || 0
          const n = t.length - r
          i ? (i = Number(i)) > n && (i = n) : (i = n)
          const o = e.length
          let s
          for (i > o / 2 && (i = o / 2), s = 0; s < i; ++s) {
            const i = parseInt(e.substr(2 * s, 2), 16)
            if (K(i)) return s
            t[r + s] = i
          }
          return s
        }
        function b(t, e, r, i) {
          return V(Y(e, t.length - r), t, r, i)
        }
        function B(t, e, r, i) {
          return V(
            (function (t) {
              const e = []
              for (let r = 0; r < t.length; ++r) e.push(255 & t.charCodeAt(r))
              return e
            })(e),
            t,
            r,
            i
          )
        }
        function A(t, e, r, i) {
          return V(G(e), t, r, i)
        }
        function E(t, e, r, i) {
          return V(
            (function (t, e) {
              let r, i, n
              const o = []
              for (let s = 0; s < t.length && !((e -= 2) < 0); ++s)
                (r = t.charCodeAt(s)),
                  (i = r >> 8),
                  (n = r % 256),
                  o.push(n),
                  o.push(i)
              return o
            })(e, t.length - r),
            t,
            r,
            i
          )
        }
        function _(t, e, r) {
          return 0 === e && r === t.length
            ? i.fromByteArray(t)
            : i.fromByteArray(t.slice(e, r))
        }
        function I(t, e, r) {
          r = Math.min(t.length, r)
          const i = []
          let n = e
          for (; n < r; ) {
            const e = t[n]
            let o = null,
              s = e > 239 ? 4 : e > 223 ? 3 : e > 191 ? 2 : 1
            if (n + s <= r) {
              let r, i, h, u
              switch (s) {
                case 1:
                  e < 128 && (o = e)
                  break
                case 2:
                  ;(r = t[n + 1]),
                    128 == (192 & r) &&
                      ((u = ((31 & e) << 6) | (63 & r)), u > 127 && (o = u))
                  break
                case 3:
                  ;(r = t[n + 1]),
                    (i = t[n + 2]),
                    128 == (192 & r) &&
                      128 == (192 & i) &&
                      ((u = ((15 & e) << 12) | ((63 & r) << 6) | (63 & i)),
                      u > 2047 && (u < 55296 || u > 57343) && (o = u))
                  break
                case 4:
                  ;(r = t[n + 1]),
                    (i = t[n + 2]),
                    (h = t[n + 3]),
                    128 == (192 & r) &&
                      128 == (192 & i) &&
                      128 == (192 & h) &&
                      ((u =
                        ((15 & e) << 18) |
                        ((63 & r) << 12) |
                        ((63 & i) << 6) |
                        (63 & h)),
                      u > 65535 && u < 1114112 && (o = u))
              }
            }
            null === o
              ? ((o = 65533), (s = 1))
              : o > 65535 &&
                ((o -= 65536),
                i.push(((o >>> 10) & 1023) | 55296),
                (o = 56320 | (1023 & o))),
              i.push(o),
              (n += s)
          }
          return (function (t) {
            const e = t.length
            if (e <= U) return String.fromCharCode.apply(String, t)
            let r = '',
              i = 0
            for (; i < e; )
              r += String.fromCharCode.apply(String, t.slice(i, (i += U)))
            return r
          })(i)
        }
        ;(e.kMaxLength = s),
          (u.TYPED_ARRAY_SUPPORT = (function () {
            try {
              const t = new Uint8Array(1),
                e = {
                  foo: function () {
                    return 42
                  }
                }
              return (
                Object.setPrototypeOf(e, Uint8Array.prototype),
                Object.setPrototypeOf(t, e),
                42 === t.foo()
              )
            } catch (t) {
              return !1
            }
          })()),
          u.TYPED_ARRAY_SUPPORT ||
            'undefined' == typeof console ||
            'function' != typeof console.error ||
            console.error(
              'This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
            ),
          Object.defineProperty(u.prototype, 'parent', {
            enumerable: !0,
            get: function () {
              if (u.isBuffer(this)) return this.buffer
            }
          }),
          Object.defineProperty(u.prototype, 'offset', {
            enumerable: !0,
            get: function () {
              if (u.isBuffer(this)) return this.byteOffset
            }
          }),
          (u.poolSize = 8192),
          (u.from = function (t, e, r) {
            return a(t, e, r)
          }),
          Object.setPrototypeOf(u.prototype, Uint8Array.prototype),
          Object.setPrototypeOf(u, Uint8Array),
          (u.alloc = function (t, e, r) {
            return (function (t, e, r) {
              return (
                f(t),
                t <= 0
                  ? h(t)
                  : void 0 !== e
                  ? 'string' == typeof r
                    ? h(t).fill(e, r)
                    : h(t).fill(e)
                  : h(t)
              )
            })(t, e, r)
          }),
          (u.allocUnsafe = function (t) {
            return l(t)
          }),
          (u.allocUnsafeSlow = function (t) {
            return l(t)
          }),
          (u.isBuffer = function (t) {
            return null != t && !0 === t._isBuffer && t !== u.prototype
          }),
          (u.compare = function (t, e) {
            if (
              (X(t, Uint8Array) && (t = u.from(t, t.offset, t.byteLength)),
              X(e, Uint8Array) && (e = u.from(e, e.offset, e.byteLength)),
              !u.isBuffer(t) || !u.isBuffer(e))
            )
              throw new TypeError(
                'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
              )
            if (t === e) return 0
            let r = t.length,
              i = e.length
            for (let n = 0, o = Math.min(r, i); n < o; ++n)
              if (t[n] !== e[n]) {
                ;(r = t[n]), (i = e[n])
                break
              }
            return r < i ? -1 : i < r ? 1 : 0
          }),
          (u.isEncoding = function (t) {
            switch (String(t).toLowerCase()) {
              case 'hex':
              case 'utf8':
              case 'utf-8':
              case 'ascii':
              case 'latin1':
              case 'binary':
              case 'base64':
              case 'ucs2':
              case 'ucs-2':
              case 'utf16le':
              case 'utf-16le':
                return !0
              default:
                return !1
            }
          }),
          (u.concat = function (t, e) {
            if (!Array.isArray(t))
              throw new TypeError('"list" argument must be an Array of Buffers')
            if (0 === t.length) return u.alloc(0)
            let r
            if (void 0 === e)
              for (e = 0, r = 0; r < t.length; ++r) e += t[r].length
            const i = u.allocUnsafe(e)
            let n = 0
            for (r = 0; r < t.length; ++r) {
              let e = t[r]
              if (X(e, Uint8Array))
                n + e.length > i.length
                  ? (u.isBuffer(e) || (e = u.from(e)), e.copy(i, n))
                  : Uint8Array.prototype.set.call(i, e, n)
              else {
                if (!u.isBuffer(e))
                  throw new TypeError(
                    '"list" argument must be an Array of Buffers'
                  )
                e.copy(i, n)
              }
              n += e.length
            }
            return i
          }),
          (u.byteLength = m),
          (u.prototype._isBuffer = !0),
          (u.prototype.swap16 = function () {
            const t = this.length
            if (t % 2 != 0)
              throw new RangeError('Buffer size must be a multiple of 16-bits')
            for (let e = 0; e < t; e += 2) y(this, e, e + 1)
            return this
          }),
          (u.prototype.swap32 = function () {
            const t = this.length
            if (t % 4 != 0)
              throw new RangeError('Buffer size must be a multiple of 32-bits')
            for (let e = 0; e < t; e += 4)
              y(this, e, e + 3), y(this, e + 1, e + 2)
            return this
          }),
          (u.prototype.swap64 = function () {
            const t = this.length
            if (t % 8 != 0)
              throw new RangeError('Buffer size must be a multiple of 64-bits')
            for (let e = 0; e < t; e += 8)
              y(this, e, e + 7),
                y(this, e + 1, e + 6),
                y(this, e + 2, e + 5),
                y(this, e + 3, e + 4)
            return this
          }),
          (u.prototype.toString = function () {
            const t = this.length
            return 0 === t
              ? ''
              : 0 === arguments.length
              ? I(this, 0, t)
              : g.apply(this, arguments)
          }),
          (u.prototype.toLocaleString = u.prototype.toString),
          (u.prototype.equals = function (t) {
            if (!u.isBuffer(t)) throw new TypeError('Argument must be a Buffer')
            return this === t || 0 === u.compare(this, t)
          }),
          (u.prototype.inspect = function () {
            let t = ''
            const r = e.INSPECT_MAX_BYTES
            return (
              (t = this.toString('hex', 0, r)
                .replace(/(.{2})/g, '$1 ')
                .trim()),
              this.length > r && (t += ' ... '),
              '<Buffer ' + t + '>'
            )
          }),
          o && (u.prototype[o] = u.prototype.inspect),
          (u.prototype.compare = function (t, e, r, i, n) {
            if (
              (X(t, Uint8Array) && (t = u.from(t, t.offset, t.byteLength)),
              !u.isBuffer(t))
            )
              throw new TypeError(
                'The "target" argument must be one of type Buffer or Uint8Array. Received type ' +
                  typeof t
              )
            if (
              (void 0 === e && (e = 0),
              void 0 === r && (r = t ? t.length : 0),
              void 0 === i && (i = 0),
              void 0 === n && (n = this.length),
              e < 0 || r > t.length || i < 0 || n > this.length)
            )
              throw new RangeError('out of range index')
            if (i >= n && e >= r) return 0
            if (i >= n) return -1
            if (e >= r) return 1
            if (this === t) return 0
            let o = (n >>>= 0) - (i >>>= 0),
              s = (r >>>= 0) - (e >>>= 0)
            const h = Math.min(o, s),
              a = this.slice(i, n),
              f = t.slice(e, r)
            for (let t = 0; t < h; ++t)
              if (a[t] !== f[t]) {
                ;(o = a[t]), (s = f[t])
                break
              }
            return o < s ? -1 : s < o ? 1 : 0
          }),
          (u.prototype.includes = function (t, e, r) {
            return -1 !== this.indexOf(t, e, r)
          }),
          (u.prototype.indexOf = function (t, e, r) {
            return w(this, t, e, r, !0)
          }),
          (u.prototype.lastIndexOf = function (t, e, r) {
            return w(this, t, e, r, !1)
          }),
          (u.prototype.write = function (t, e, r, i) {
            if (void 0 === e) (i = 'utf8'), (r = this.length), (e = 0)
            else if (void 0 === r && 'string' == typeof e)
              (i = e), (r = this.length), (e = 0)
            else {
              if (!isFinite(e))
                throw new Error(
                  'Buffer.write(string, encoding, offset[, length]) is no longer supported'
                )
              ;(e >>>= 0),
                isFinite(r)
                  ? ((r >>>= 0), void 0 === i && (i = 'utf8'))
                  : ((i = r), (r = void 0))
            }
            const n = this.length - e
            if (
              ((void 0 === r || r > n) && (r = n),
              (t.length > 0 && (r < 0 || e < 0)) || e > this.length)
            )
              throw new RangeError('Attempt to write outside buffer bounds')
            i || (i = 'utf8')
            let o = !1
            for (;;)
              switch (i) {
                case 'hex':
                  return M(this, t, e, r)
                case 'utf8':
                case 'utf-8':
                  return b(this, t, e, r)
                case 'ascii':
                case 'latin1':
                case 'binary':
                  return B(this, t, e, r)
                case 'base64':
                  return A(this, t, e, r)
                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                  return E(this, t, e, r)
                default:
                  if (o) throw new TypeError('Unknown encoding: ' + i)
                  ;(i = ('' + i).toLowerCase()), (o = !0)
              }
          }),
          (u.prototype.toJSON = function () {
            return {
              type: 'Buffer',
              data: Array.prototype.slice.call(this._arr || this, 0)
            }
          })
        const U = 4096
        function x(t, e, r) {
          let i = ''
          r = Math.min(t.length, r)
          for (let n = e; n < r; ++n) i += String.fromCharCode(127 & t[n])
          return i
        }
        function R(t, e, r) {
          let i = ''
          r = Math.min(t.length, r)
          for (let n = e; n < r; ++n) i += String.fromCharCode(t[n])
          return i
        }
        function T(t, e, r) {
          const i = t.length
          ;(!e || e < 0) && (e = 0), (!r || r < 0 || r > i) && (r = i)
          let n = ''
          for (let i = e; i < r; ++i) n += H[t[i]]
          return n
        }
        function S(t, e, r) {
          const i = t.slice(e, r)
          let n = ''
          for (let t = 0; t < i.length - 1; t += 2)
            n += String.fromCharCode(i[t] + 256 * i[t + 1])
          return n
        }
        function L(t, e, r) {
          if (t % 1 != 0 || t < 0) throw new RangeError('offset is not uint')
          if (t + e > r)
            throw new RangeError('Trying to access beyond buffer length')
        }
        function O(t, e, r, i, n, o) {
          if (!u.isBuffer(t))
            throw new TypeError('"buffer" argument must be a Buffer instance')
          if (e > n || e < o)
            throw new RangeError('"value" argument is out of bounds')
          if (r + i > t.length) throw new RangeError('Index out of range')
        }
        function k(t, e, r, i, n) {
          F(e, i, n, t, r, 7)
          let o = Number(e & BigInt(4294967295))
          ;(t[r++] = o),
            (o >>= 8),
            (t[r++] = o),
            (o >>= 8),
            (t[r++] = o),
            (o >>= 8),
            (t[r++] = o)
          let s = Number((e >> BigInt(32)) & BigInt(4294967295))
          return (
            (t[r++] = s),
            (s >>= 8),
            (t[r++] = s),
            (s >>= 8),
            (t[r++] = s),
            (s >>= 8),
            (t[r++] = s),
            r
          )
        }
        function N(t, e, r, i, n) {
          F(e, i, n, t, r, 7)
          let o = Number(e & BigInt(4294967295))
          ;(t[r + 7] = o),
            (o >>= 8),
            (t[r + 6] = o),
            (o >>= 8),
            (t[r + 5] = o),
            (o >>= 8),
            (t[r + 4] = o)
          let s = Number((e >> BigInt(32)) & BigInt(4294967295))
          return (
            (t[r + 3] = s),
            (s >>= 8),
            (t[r + 2] = s),
            (s >>= 8),
            (t[r + 1] = s),
            (s >>= 8),
            (t[r] = s),
            r + 8
          )
        }
        function $(t, e, r, i, n, o) {
          if (r + i > t.length) throw new RangeError('Index out of range')
          if (r < 0) throw new RangeError('Index out of range')
        }
        function C(t, e, r, i, o) {
          return (
            (e = +e),
            (r >>>= 0),
            o || $(t, 0, r, 4),
            n.write(t, e, r, i, 23, 4),
            r + 4
          )
        }
        function P(t, e, r, i, o) {
          return (
            (e = +e),
            (r >>>= 0),
            o || $(t, 0, r, 8),
            n.write(t, e, r, i, 52, 8),
            r + 8
          )
        }
        ;(u.prototype.slice = function (t, e) {
          const r = this.length
          ;(t = ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r),
            (e = void 0 === e ? r : ~~e) < 0
              ? (e += r) < 0 && (e = 0)
              : e > r && (e = r),
            e < t && (e = t)
          const i = this.subarray(t, e)
          return Object.setPrototypeOf(i, u.prototype), i
        }),
          (u.prototype.readUintLE = u.prototype.readUIntLE =
            function (t, e, r) {
              ;(t >>>= 0), (e >>>= 0), r || L(t, e, this.length)
              let i = this[t],
                n = 1,
                o = 0
              for (; ++o < e && (n *= 256); ) i += this[t + o] * n
              return i
            }),
          (u.prototype.readUintBE = u.prototype.readUIntBE =
            function (t, e, r) {
              ;(t >>>= 0), (e >>>= 0), r || L(t, e, this.length)
              let i = this[t + --e],
                n = 1
              for (; e > 0 && (n *= 256); ) i += this[t + --e] * n
              return i
            }),
          (u.prototype.readUint8 = u.prototype.readUInt8 =
            function (t, e) {
              return (t >>>= 0), e || L(t, 1, this.length), this[t]
            }),
          (u.prototype.readUint16LE = u.prototype.readUInt16LE =
            function (t, e) {
              return (
                (t >>>= 0),
                e || L(t, 2, this.length),
                this[t] | (this[t + 1] << 8)
              )
            }),
          (u.prototype.readUint16BE = u.prototype.readUInt16BE =
            function (t, e) {
              return (
                (t >>>= 0),
                e || L(t, 2, this.length),
                (this[t] << 8) | this[t + 1]
              )
            }),
          (u.prototype.readUint32LE = u.prototype.readUInt32LE =
            function (t, e) {
              return (
                (t >>>= 0),
                e || L(t, 4, this.length),
                (this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) +
                  16777216 * this[t + 3]
              )
            }),
          (u.prototype.readUint32BE = u.prototype.readUInt32BE =
            function (t, e) {
              return (
                (t >>>= 0),
                e || L(t, 4, this.length),
                16777216 * this[t] +
                  ((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3])
              )
            }),
          (u.prototype.readBigUInt64LE = J(function (t) {
            D((t >>>= 0), 'offset')
            const e = this[t],
              r = this[t + 7]
            ;(void 0 !== e && void 0 !== r) || z(t, this.length - 8)
            const i =
                e + 256 * this[++t] + 65536 * this[++t] + this[++t] * 2 ** 24,
              n = this[++t] + 256 * this[++t] + 65536 * this[++t] + r * 2 ** 24
            return BigInt(i) + (BigInt(n) << BigInt(32))
          })),
          (u.prototype.readBigUInt64BE = J(function (t) {
            D((t >>>= 0), 'offset')
            const e = this[t],
              r = this[t + 7]
            ;(void 0 !== e && void 0 !== r) || z(t, this.length - 8)
            const i =
                e * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + this[++t],
              n = this[++t] * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + r
            return (BigInt(i) << BigInt(32)) + BigInt(n)
          })),
          (u.prototype.readIntLE = function (t, e, r) {
            ;(t >>>= 0), (e >>>= 0), r || L(t, e, this.length)
            let i = this[t],
              n = 1,
              o = 0
            for (; ++o < e && (n *= 256); ) i += this[t + o] * n
            return (n *= 128), i >= n && (i -= Math.pow(2, 8 * e)), i
          }),
          (u.prototype.readIntBE = function (t, e, r) {
            ;(t >>>= 0), (e >>>= 0), r || L(t, e, this.length)
            let i = e,
              n = 1,
              o = this[t + --i]
            for (; i > 0 && (n *= 256); ) o += this[t + --i] * n
            return (n *= 128), o >= n && (o -= Math.pow(2, 8 * e)), o
          }),
          (u.prototype.readInt8 = function (t, e) {
            return (
              (t >>>= 0),
              e || L(t, 1, this.length),
              128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
            )
          }),
          (u.prototype.readInt16LE = function (t, e) {
            ;(t >>>= 0), e || L(t, 2, this.length)
            const r = this[t] | (this[t + 1] << 8)
            return 32768 & r ? 4294901760 | r : r
          }),
          (u.prototype.readInt16BE = function (t, e) {
            ;(t >>>= 0), e || L(t, 2, this.length)
            const r = this[t + 1] | (this[t] << 8)
            return 32768 & r ? 4294901760 | r : r
          }),
          (u.prototype.readInt32LE = function (t, e) {
            return (
              (t >>>= 0),
              e || L(t, 4, this.length),
              this[t] |
                (this[t + 1] << 8) |
                (this[t + 2] << 16) |
                (this[t + 3] << 24)
            )
          }),
          (u.prototype.readInt32BE = function (t, e) {
            return (
              (t >>>= 0),
              e || L(t, 4, this.length),
              (this[t] << 24) |
                (this[t + 1] << 16) |
                (this[t + 2] << 8) |
                this[t + 3]
            )
          }),
          (u.prototype.readBigInt64LE = J(function (t) {
            D((t >>>= 0), 'offset')
            const e = this[t],
              r = this[t + 7]
            ;(void 0 !== e && void 0 !== r) || z(t, this.length - 8)
            const i =
              this[t + 4] + 256 * this[t + 5] + 65536 * this[t + 6] + (r << 24)
            return (
              (BigInt(i) << BigInt(32)) +
              BigInt(
                e + 256 * this[++t] + 65536 * this[++t] + this[++t] * 2 ** 24
              )
            )
          })),
          (u.prototype.readBigInt64BE = J(function (t) {
            D((t >>>= 0), 'offset')
            const e = this[t],
              r = this[t + 7]
            ;(void 0 !== e && void 0 !== r) || z(t, this.length - 8)
            const i =
              (e << 24) + 65536 * this[++t] + 256 * this[++t] + this[++t]
            return (
              (BigInt(i) << BigInt(32)) +
              BigInt(
                this[++t] * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + r
              )
            )
          })),
          (u.prototype.readFloatLE = function (t, e) {
            return (
              (t >>>= 0), e || L(t, 4, this.length), n.read(this, t, !0, 23, 4)
            )
          }),
          (u.prototype.readFloatBE = function (t, e) {
            return (
              (t >>>= 0), e || L(t, 4, this.length), n.read(this, t, !1, 23, 4)
            )
          }),
          (u.prototype.readDoubleLE = function (t, e) {
            return (
              (t >>>= 0), e || L(t, 8, this.length), n.read(this, t, !0, 52, 8)
            )
          }),
          (u.prototype.readDoubleBE = function (t, e) {
            return (
              (t >>>= 0), e || L(t, 8, this.length), n.read(this, t, !1, 52, 8)
            )
          }),
          (u.prototype.writeUintLE = u.prototype.writeUIntLE =
            function (t, e, r, i) {
              ;(t = +t),
                (e >>>= 0),
                (r >>>= 0),
                i || O(this, t, e, r, Math.pow(2, 8 * r) - 1, 0)
              let n = 1,
                o = 0
              for (this[e] = 255 & t; ++o < r && (n *= 256); )
                this[e + o] = (t / n) & 255
              return e + r
            }),
          (u.prototype.writeUintBE = u.prototype.writeUIntBE =
            function (t, e, r, i) {
              ;(t = +t),
                (e >>>= 0),
                (r >>>= 0),
                i || O(this, t, e, r, Math.pow(2, 8 * r) - 1, 0)
              let n = r - 1,
                o = 1
              for (this[e + n] = 255 & t; --n >= 0 && (o *= 256); )
                this[e + n] = (t / o) & 255
              return e + r
            }),
          (u.prototype.writeUint8 = u.prototype.writeUInt8 =
            function (t, e, r) {
              return (
                (t = +t),
                (e >>>= 0),
                r || O(this, t, e, 1, 255, 0),
                (this[e] = 255 & t),
                e + 1
              )
            }),
          (u.prototype.writeUint16LE = u.prototype.writeUInt16LE =
            function (t, e, r) {
              return (
                (t = +t),
                (e >>>= 0),
                r || O(this, t, e, 2, 65535, 0),
                (this[e] = 255 & t),
                (this[e + 1] = t >>> 8),
                e + 2
              )
            }),
          (u.prototype.writeUint16BE = u.prototype.writeUInt16BE =
            function (t, e, r) {
              return (
                (t = +t),
                (e >>>= 0),
                r || O(this, t, e, 2, 65535, 0),
                (this[e] = t >>> 8),
                (this[e + 1] = 255 & t),
                e + 2
              )
            }),
          (u.prototype.writeUint32LE = u.prototype.writeUInt32LE =
            function (t, e, r) {
              return (
                (t = +t),
                (e >>>= 0),
                r || O(this, t, e, 4, 4294967295, 0),
                (this[e + 3] = t >>> 24),
                (this[e + 2] = t >>> 16),
                (this[e + 1] = t >>> 8),
                (this[e] = 255 & t),
                e + 4
              )
            }),
          (u.prototype.writeUint32BE = u.prototype.writeUInt32BE =
            function (t, e, r) {
              return (
                (t = +t),
                (e >>>= 0),
                r || O(this, t, e, 4, 4294967295, 0),
                (this[e] = t >>> 24),
                (this[e + 1] = t >>> 16),
                (this[e + 2] = t >>> 8),
                (this[e + 3] = 255 & t),
                e + 4
              )
            }),
          (u.prototype.writeBigUInt64LE = J(function (t, e = 0) {
            return k(this, t, e, BigInt(0), BigInt('0xffffffffffffffff'))
          })),
          (u.prototype.writeBigUInt64BE = J(function (t, e = 0) {
            return N(this, t, e, BigInt(0), BigInt('0xffffffffffffffff'))
          })),
          (u.prototype.writeIntLE = function (t, e, r, i) {
            if (((t = +t), (e >>>= 0), !i)) {
              const i = Math.pow(2, 8 * r - 1)
              O(this, t, e, r, i - 1, -i)
            }
            let n = 0,
              o = 1,
              s = 0
            for (this[e] = 255 & t; ++n < r && (o *= 256); )
              t < 0 && 0 === s && 0 !== this[e + n - 1] && (s = 1),
                (this[e + n] = (((t / o) >> 0) - s) & 255)
            return e + r
          }),
          (u.prototype.writeIntBE = function (t, e, r, i) {
            if (((t = +t), (e >>>= 0), !i)) {
              const i = Math.pow(2, 8 * r - 1)
              O(this, t, e, r, i - 1, -i)
            }
            let n = r - 1,
              o = 1,
              s = 0
            for (this[e + n] = 255 & t; --n >= 0 && (o *= 256); )
              t < 0 && 0 === s && 0 !== this[e + n + 1] && (s = 1),
                (this[e + n] = (((t / o) >> 0) - s) & 255)
            return e + r
          }),
          (u.prototype.writeInt8 = function (t, e, r) {
            return (
              (t = +t),
              (e >>>= 0),
              r || O(this, t, e, 1, 127, -128),
              t < 0 && (t = 255 + t + 1),
              (this[e] = 255 & t),
              e + 1
            )
          }),
          (u.prototype.writeInt16LE = function (t, e, r) {
            return (
              (t = +t),
              (e >>>= 0),
              r || O(this, t, e, 2, 32767, -32768),
              (this[e] = 255 & t),
              (this[e + 1] = t >>> 8),
              e + 2
            )
          }),
          (u.prototype.writeInt16BE = function (t, e, r) {
            return (
              (t = +t),
              (e >>>= 0),
              r || O(this, t, e, 2, 32767, -32768),
              (this[e] = t >>> 8),
              (this[e + 1] = 255 & t),
              e + 2
            )
          }),
          (u.prototype.writeInt32LE = function (t, e, r) {
            return (
              (t = +t),
              (e >>>= 0),
              r || O(this, t, e, 4, 2147483647, -2147483648),
              (this[e] = 255 & t),
              (this[e + 1] = t >>> 8),
              (this[e + 2] = t >>> 16),
              (this[e + 3] = t >>> 24),
              e + 4
            )
          }),
          (u.prototype.writeInt32BE = function (t, e, r) {
            return (
              (t = +t),
              (e >>>= 0),
              r || O(this, t, e, 4, 2147483647, -2147483648),
              t < 0 && (t = 4294967295 + t + 1),
              (this[e] = t >>> 24),
              (this[e + 1] = t >>> 16),
              (this[e + 2] = t >>> 8),
              (this[e + 3] = 255 & t),
              e + 4
            )
          }),
          (u.prototype.writeBigInt64LE = J(function (t, e = 0) {
            return k(
              this,
              t,
              e,
              -BigInt('0x8000000000000000'),
              BigInt('0x7fffffffffffffff')
            )
          })),
          (u.prototype.writeBigInt64BE = J(function (t, e = 0) {
            return N(
              this,
              t,
              e,
              -BigInt('0x8000000000000000'),
              BigInt('0x7fffffffffffffff')
            )
          })),
          (u.prototype.writeFloatLE = function (t, e, r) {
            return C(this, t, e, !0, r)
          }),
          (u.prototype.writeFloatBE = function (t, e, r) {
            return C(this, t, e, !1, r)
          }),
          (u.prototype.writeDoubleLE = function (t, e, r) {
            return P(this, t, e, !0, r)
          }),
          (u.prototype.writeDoubleBE = function (t, e, r) {
            return P(this, t, e, !1, r)
          }),
          (u.prototype.copy = function (t, e, r, i) {
            if (!u.isBuffer(t))
              throw new TypeError('argument should be a Buffer')
            if (
              (r || (r = 0),
              i || 0 === i || (i = this.length),
              e >= t.length && (e = t.length),
              e || (e = 0),
              i > 0 && i < r && (i = r),
              i === r)
            )
              return 0
            if (0 === t.length || 0 === this.length) return 0
            if (e < 0) throw new RangeError('targetStart out of bounds')
            if (r < 0 || r >= this.length)
              throw new RangeError('Index out of range')
            if (i < 0) throw new RangeError('sourceEnd out of bounds')
            i > this.length && (i = this.length),
              t.length - e < i - r && (i = t.length - e + r)
            const n = i - r
            return (
              this === t && 'function' == typeof Uint8Array.prototype.copyWithin
                ? this.copyWithin(e, r, i)
                : Uint8Array.prototype.set.call(t, this.subarray(r, i), e),
              n
            )
          }),
          (u.prototype.fill = function (t, e, r, i) {
            if ('string' == typeof t) {
              if (
                ('string' == typeof e
                  ? ((i = e), (e = 0), (r = this.length))
                  : 'string' == typeof r && ((i = r), (r = this.length)),
                void 0 !== i && 'string' != typeof i)
              )
                throw new TypeError('encoding must be a string')
              if ('string' == typeof i && !u.isEncoding(i))
                throw new TypeError('Unknown encoding: ' + i)
              if (1 === t.length) {
                const e = t.charCodeAt(0)
                ;(('utf8' === i && e < 128) || 'latin1' === i) && (t = e)
              }
            } else
              'number' == typeof t
                ? (t &= 255)
                : 'boolean' == typeof t && (t = Number(t))
            if (e < 0 || this.length < e || this.length < r)
              throw new RangeError('Out of range index')
            if (r <= e) return this
            let n
            if (
              ((e >>>= 0),
              (r = void 0 === r ? this.length : r >>> 0),
              t || (t = 0),
              'number' == typeof t)
            )
              for (n = e; n < r; ++n) this[n] = t
            else {
              const o = u.isBuffer(t) ? t : u.from(t, i),
                s = o.length
              if (0 === s)
                throw new TypeError(
                  'The value "' + t + '" is invalid for argument "value"'
                )
              for (n = 0; n < r - e; ++n) this[n + e] = o[n % s]
            }
            return this
          })
        const j = {}
        function q(t, e, r) {
          j[t] = class extends r {
            constructor() {
              super(),
                Object.defineProperty(this, 'message', {
                  value: e.apply(this, arguments),
                  writable: !0,
                  configurable: !0
                }),
                (this.name = `${this.name} [${t}]`),
                this.stack,
                delete this.name
            }
            get code() {
              return t
            }
            set code(t) {
              Object.defineProperty(this, 'code', {
                configurable: !0,
                enumerable: !0,
                value: t,
                writable: !0
              })
            }
            toString() {
              return `${this.name} [${t}]: ${this.message}`
            }
          }
        }
        function Z(t) {
          let e = '',
            r = t.length
          const i = '-' === t[0] ? 1 : 0
          for (; r >= i + 4; r -= 3) e = `_${t.slice(r - 3, r)}${e}`
          return `${t.slice(0, r)}${e}`
        }
        function F(t, e, r, i, n, o) {
          if (t > r || t < e) {
            const i = 'bigint' == typeof e ? 'n' : ''
            let n
            throw (
              ((n =
                o > 3
                  ? 0 === e || e === BigInt(0)
                    ? `>= 0${i} and < 2${i} ** ${8 * (o + 1)}${i}`
                    : `>= -(2${i} ** ${8 * (o + 1) - 1}${i}) and < 2 ** ${
                        8 * (o + 1) - 1
                      }${i}`
                  : `>= ${e}${i} and <= ${r}${i}`),
              new j.ERR_OUT_OF_RANGE('value', n, t))
            )
          }
          !(function (t, e, r) {
            D(e, 'offset'),
              (void 0 !== t[e] && void 0 !== t[e + r]) ||
                z(e, t.length - (r + 1))
          })(i, n, o)
        }
        function D(t, e) {
          if ('number' != typeof t)
            throw new j.ERR_INVALID_ARG_TYPE(e, 'number', t)
        }
        function z(t, e, r) {
          if (Math.floor(t) !== t)
            throw (
              (D(t, r), new j.ERR_OUT_OF_RANGE(r || 'offset', 'an integer', t))
            )
          if (e < 0) throw new j.ERR_BUFFER_OUT_OF_BOUNDS()
          throw new j.ERR_OUT_OF_RANGE(
            r || 'offset',
            `>= ${r ? 1 : 0} and <= ${e}`,
            t
          )
        }
        q(
          'ERR_BUFFER_OUT_OF_BOUNDS',
          function (t) {
            return t
              ? `${t} is outside of buffer bounds`
              : 'Attempt to access memory outside buffer bounds'
          },
          RangeError
        ),
          q(
            'ERR_INVALID_ARG_TYPE',
            function (t, e) {
              return `The "${t}" argument must be of type number. Received type ${typeof e}`
            },
            TypeError
          ),
          q(
            'ERR_OUT_OF_RANGE',
            function (t, e, r) {
              let i = `The value of "${t}" is out of range.`,
                n = r
              return (
                Number.isInteger(r) && Math.abs(r) > 2 ** 32
                  ? (n = Z(String(r)))
                  : 'bigint' == typeof r &&
                    ((n = String(r)),
                    (r > BigInt(2) ** BigInt(32) ||
                      r < -(BigInt(2) ** BigInt(32))) &&
                      (n = Z(n)),
                    (n += 'n')),
                (i += ` It must be ${e}. Received ${n}`),
                i
              )
            },
            RangeError
          )
        const W = /[^+/0-9A-Za-z-_]/g
        function Y(t, e) {
          let r
          e = e || 1 / 0
          const i = t.length
          let n = null
          const o = []
          for (let s = 0; s < i; ++s) {
            if (((r = t.charCodeAt(s)), r > 55295 && r < 57344)) {
              if (!n) {
                if (r > 56319) {
                  ;(e -= 3) > -1 && o.push(239, 191, 189)
                  continue
                }
                if (s + 1 === i) {
                  ;(e -= 3) > -1 && o.push(239, 191, 189)
                  continue
                }
                n = r
                continue
              }
              if (r < 56320) {
                ;(e -= 3) > -1 && o.push(239, 191, 189), (n = r)
                continue
              }
              r = 65536 + (((n - 55296) << 10) | (r - 56320))
            } else n && (e -= 3) > -1 && o.push(239, 191, 189)
            if (((n = null), r < 128)) {
              if ((e -= 1) < 0) break
              o.push(r)
            } else if (r < 2048) {
              if ((e -= 2) < 0) break
              o.push((r >> 6) | 192, (63 & r) | 128)
            } else if (r < 65536) {
              if ((e -= 3) < 0) break
              o.push((r >> 12) | 224, ((r >> 6) & 63) | 128, (63 & r) | 128)
            } else {
              if (!(r < 1114112)) throw new Error('Invalid code point')
              if ((e -= 4) < 0) break
              o.push(
                (r >> 18) | 240,
                ((r >> 12) & 63) | 128,
                ((r >> 6) & 63) | 128,
                (63 & r) | 128
              )
            }
          }
          return o
        }
        function G(t) {
          return i.toByteArray(
            (function (t) {
              if ((t = (t = t.split('=')[0]).trim().replace(W, '')).length < 2)
                return ''
              for (; t.length % 4 != 0; ) t += '='
              return t
            })(t)
          )
        }
        function V(t, e, r, i) {
          let n
          for (n = 0; n < i && !(n + r >= e.length || n >= t.length); ++n)
            e[n + r] = t[n]
          return n
        }
        function X(t, e) {
          return (
            t instanceof e ||
            (null != t &&
              null != t.constructor &&
              null != t.constructor.name &&
              t.constructor.name === e.name)
          )
        }
        function K(t) {
          return t != t
        }
        const H = (function () {
          const t = '0123456789abcdef',
            e = new Array(256)
          for (let r = 0; r < 16; ++r) {
            const i = 16 * r
            for (let n = 0; n < 16; ++n) e[i + n] = t[r] + t[n]
          }
          return e
        })()
        function J(t) {
          return 'undefined' == typeof BigInt ? Q : t
        }
        function Q() {
          throw new Error('BigInt not supported')
        }
      },
      161: (t) => {
        'use strict'
        var e = Object.prototype.hasOwnProperty,
          r = '~'
        function i() {}
        function n(t, e, r) {
          ;(this.fn = t), (this.context = e), (this.once = r || !1)
        }
        function o(t, e, i, o, s) {
          if ('function' != typeof i)
            throw new TypeError('The listener must be a function')
          var h = new n(i, o || t, s),
            u = r ? r + e : e
          return (
            t._events[u]
              ? t._events[u].fn
                ? (t._events[u] = [t._events[u], h])
                : t._events[u].push(h)
              : ((t._events[u] = h), t._eventsCount++),
            t
          )
        }
        function s(t, e) {
          0 == --t._eventsCount ? (t._events = new i()) : delete t._events[e]
        }
        function h() {
          ;(this._events = new i()), (this._eventsCount = 0)
        }
        Object.create &&
          ((i.prototype = Object.create(null)), new i().__proto__ || (r = !1)),
          (h.prototype.eventNames = function () {
            var t,
              i,
              n = []
            if (0 === this._eventsCount) return n
            for (i in (t = this._events))
              e.call(t, i) && n.push(r ? i.slice(1) : i)
            return Object.getOwnPropertySymbols
              ? n.concat(Object.getOwnPropertySymbols(t))
              : n
          }),
          (h.prototype.listeners = function (t) {
            var e = r ? r + t : t,
              i = this._events[e]
            if (!i) return []
            if (i.fn) return [i.fn]
            for (var n = 0, o = i.length, s = new Array(o); n < o; n++)
              s[n] = i[n].fn
            return s
          }),
          (h.prototype.listenerCount = function (t) {
            var e = r ? r + t : t,
              i = this._events[e]
            return i ? (i.fn ? 1 : i.length) : 0
          }),
          (h.prototype.emit = function (t, e, i, n, o, s) {
            var h = r ? r + t : t
            if (!this._events[h]) return !1
            var u,
              a,
              f = this._events[h],
              l = arguments.length
            if (f.fn) {
              switch ((f.once && this.removeListener(t, f.fn, void 0, !0), l)) {
                case 1:
                  return f.fn.call(f.context), !0
                case 2:
                  return f.fn.call(f.context, e), !0
                case 3:
                  return f.fn.call(f.context, e, i), !0
                case 4:
                  return f.fn.call(f.context, e, i, n), !0
                case 5:
                  return f.fn.call(f.context, e, i, n, o), !0
                case 6:
                  return f.fn.call(f.context, e, i, n, o, s), !0
              }
              for (a = 1, u = new Array(l - 1); a < l; a++)
                u[a - 1] = arguments[a]
              f.fn.apply(f.context, u)
            } else {
              var c,
                p = f.length
              for (a = 0; a < p; a++)
                switch (
                  (f[a].once && this.removeListener(t, f[a].fn, void 0, !0), l)
                ) {
                  case 1:
                    f[a].fn.call(f[a].context)
                    break
                  case 2:
                    f[a].fn.call(f[a].context, e)
                    break
                  case 3:
                    f[a].fn.call(f[a].context, e, i)
                    break
                  case 4:
                    f[a].fn.call(f[a].context, e, i, n)
                    break
                  default:
                    if (!u)
                      for (c = 1, u = new Array(l - 1); c < l; c++)
                        u[c - 1] = arguments[c]
                    f[a].fn.apply(f[a].context, u)
                }
            }
            return !0
          }),
          (h.prototype.on = function (t, e, r) {
            return o(this, t, e, r, !1)
          }),
          (h.prototype.once = function (t, e, r) {
            return o(this, t, e, r, !0)
          }),
          (h.prototype.removeListener = function (t, e, i, n) {
            var o = r ? r + t : t
            if (!this._events[o]) return this
            if (!e) return s(this, o), this
            var h = this._events[o]
            if (h.fn)
              h.fn !== e ||
                (n && !h.once) ||
                (i && h.context !== i) ||
                s(this, o)
            else {
              for (var u = 0, a = [], f = h.length; u < f; u++)
                (h[u].fn !== e ||
                  (n && !h[u].once) ||
                  (i && h[u].context !== i)) &&
                  a.push(h[u])
              a.length
                ? (this._events[o] = 1 === a.length ? a[0] : a)
                : s(this, o)
            }
            return this
          }),
          (h.prototype.removeAllListeners = function (t) {
            var e
            return (
              t
                ? ((e = r ? r + t : t), this._events[e] && s(this, e))
                : ((this._events = new i()), (this._eventsCount = 0)),
              this
            )
          }),
          (h.prototype.off = h.prototype.removeListener),
          (h.prototype.addListener = h.prototype.on),
          (h.prefixed = r),
          (h.EventEmitter = h),
          (t.exports = h)
      },
      333: (t, e) => {
        ;(e.read = function (t, e, r, i, n) {
          var o,
            s,
            h = 8 * n - i - 1,
            u = (1 << h) - 1,
            a = u >> 1,
            f = -7,
            l = r ? n - 1 : 0,
            c = r ? -1 : 1,
            p = t[e + l]
          for (
            l += c, o = p & ((1 << -f) - 1), p >>= -f, f += h;
            f > 0;
            o = 256 * o + t[e + l], l += c, f -= 8
          );
          for (
            s = o & ((1 << -f) - 1), o >>= -f, f += i;
            f > 0;
            s = 256 * s + t[e + l], l += c, f -= 8
          );
          if (0 === o) o = 1 - a
          else {
            if (o === u) return s ? NaN : (1 / 0) * (p ? -1 : 1)
            ;(s += Math.pow(2, i)), (o -= a)
          }
          return (p ? -1 : 1) * s * Math.pow(2, o - i)
        }),
          (e.write = function (t, e, r, i, n, o) {
            var s,
              h,
              u,
              a = 8 * o - n - 1,
              f = (1 << a) - 1,
              l = f >> 1,
              c = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
              p = i ? 0 : o - 1,
              d = i ? 1 : -1,
              m = e < 0 || (0 === e && 1 / e < 0) ? 1 : 0
            for (
              e = Math.abs(e),
                isNaN(e) || e === 1 / 0
                  ? ((h = isNaN(e) ? 1 : 0), (s = f))
                  : ((s = Math.floor(Math.log(e) / Math.LN2)),
                    e * (u = Math.pow(2, -s)) < 1 && (s--, (u *= 2)),
                    (e += s + l >= 1 ? c / u : c * Math.pow(2, 1 - l)) * u >=
                      2 && (s++, (u /= 2)),
                    s + l >= f
                      ? ((h = 0), (s = f))
                      : s + l >= 1
                      ? ((h = (e * u - 1) * Math.pow(2, n)), (s += l))
                      : ((h = e * Math.pow(2, l - 1) * Math.pow(2, n)),
                        (s = 0)));
              n >= 8;
              t[r + p] = 255 & h, p += d, h /= 256, n -= 8
            );
            for (
              s = (s << n) | h, a += n;
              a > 0;
              t[r + p] = 255 & s, p += d, s /= 256, a -= 8
            );
            t[r + p - d] |= 128 * m
          })
      },
      406: (t) => {
        var e,
          r,
          i = (t.exports = {})
        function n() {
          throw new Error('setTimeout has not been defined')
        }
        function o() {
          throw new Error('clearTimeout has not been defined')
        }
        function s(t) {
          if (e === setTimeout) return setTimeout(t, 0)
          if ((e === n || !e) && setTimeout)
            return (e = setTimeout), setTimeout(t, 0)
          try {
            return e(t, 0)
          } catch (r) {
            try {
              return e.call(null, t, 0)
            } catch (r) {
              return e.call(this, t, 0)
            }
          }
        }
        !(function () {
          try {
            e = 'function' == typeof setTimeout ? setTimeout : n
          } catch (t) {
            e = n
          }
          try {
            r = 'function' == typeof clearTimeout ? clearTimeout : o
          } catch (t) {
            r = o
          }
        })()
        var h,
          u = [],
          a = !1,
          f = -1
        function l() {
          a &&
            h &&
            ((a = !1), h.length ? (u = h.concat(u)) : (f = -1), u.length && c())
        }
        function c() {
          if (!a) {
            var t = s(l)
            a = !0
            for (var e = u.length; e; ) {
              for (h = u, u = []; ++f < e; ) h && h[f].run()
              ;(f = -1), (e = u.length)
            }
            ;(h = null),
              (a = !1),
              (function (t) {
                if (r === clearTimeout) return clearTimeout(t)
                if ((r === o || !r) && clearTimeout)
                  return (r = clearTimeout), clearTimeout(t)
                try {
                  r(t)
                } catch (e) {
                  try {
                    return r.call(null, t)
                  } catch (e) {
                    return r.call(this, t)
                  }
                }
              })(t)
          }
        }
        function p(t, e) {
          ;(this.fun = t), (this.array = e)
        }
        function d() {}
        ;(i.nextTick = function (t) {
          var e = new Array(arguments.length - 1)
          if (arguments.length > 1)
            for (var r = 1; r < arguments.length; r++) e[r - 1] = arguments[r]
          u.push(new p(t, e)), 1 !== u.length || a || s(c)
        }),
          (p.prototype.run = function () {
            this.fun.apply(null, this.array)
          }),
          (i.title = 'browser'),
          (i.browser = !0),
          (i.env = {}),
          (i.argv = []),
          (i.version = ''),
          (i.versions = {}),
          (i.on = d),
          (i.addListener = d),
          (i.once = d),
          (i.off = d),
          (i.removeListener = d),
          (i.removeAllListeners = d),
          (i.emit = d),
          (i.prependListener = d),
          (i.prependOnceListener = d),
          (i.listeners = function (t) {
            return []
          }),
          (i.binding = function (t) {
            throw new Error('process.binding is not supported')
          }),
          (i.cwd = function () {
            return '/'
          }),
          (i.chdir = function (t) {
            throw new Error('process.chdir is not supported')
          }),
          (i.umask = function () {
            return 0
          })
      },
      196: () => {}
    },
    e = {}
  function r(i) {
    var n = e[i]
    if (void 0 !== n) return n.exports
    var o = (e[i] = { id: i, loaded: !1, exports: {} })
    return t[i].call(o.exports, o, o.exports, r), (o.loaded = !0), o.exports
  }
  ;(r.n = (t) => {
    var e = t && t.__esModule ? () => t.default : () => t
    return r.d(e, { a: e }), e
  }),
    (r.d = (t, e) => {
      for (var i in e)
        r.o(e, i) &&
          !r.o(t, i) &&
          Object.defineProperty(t, i, { enumerable: !0, get: e[i] })
    }),
    (r.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)),
    (r.nmd = (t) => ((t.paths = []), t.children || (t.children = []), t)),
    (() => {
      'use strict'
      const t = { NODE_ENV: 'production' }.EXTENSION_PREFIX || '',
        e = `${t}page`,
        i = `${t}content`
      let n,
        o,
        s = 0
      class h {
        constructor(t) {
          n = t
        }
        get(t) {
          return n('pub(accounts.list)', { anyType: t })
        }
        subscribe(t) {
          return (
            n('pub(accounts.subscribe)', null, t).catch((t) =>
              console.error(t)
            ),
            () => {}
          )
        }
      }
      class u {
        constructor(t) {
          o = t
        }
        get() {
          return o('pub(metadata.list)')
        }
        provide(t) {
          return o('pub(metadata.provide)', t)
        }
      }
      var a = r(161),
        f = r.n(a)
      function l(t) {
        return t.toString().padStart(2, '0')
      }
      var c = r(197)
      const p =
          'undefined' != typeof globalThis
            ? globalThis
            : 'undefined' != typeof global
            ? global
            : 'undefined' != typeof self
            ? self
            : 'undefined' != typeof window
            ? window
            : Function('return this'),
        d =
          'function' == typeof p.BigInt && 'function' == typeof p.BigInt.asIntN
            ? p.BigInt
            : () => Number.NaN
      var m = r(834).Buffer,
        g = r(406)
      'function' == typeof d && d.asIntN
      const y = void 0 !== m,
        w = 'object' == typeof g
      var v = r(834).Buffer
      function M(t) {
        return y && v.isBuffer(t)
      }
      function b(t) {
        return t instanceof Uint8Array
      }
      const B = new Array(256),
        A = new Array(65536),
        E = {},
        _ = {}
      for (let t = 0; t < 256; t++) {
        const e = t.toString(16).padStart(2, '0')
        ;(B[t] = e), (E[e] = t)
      }
      for (let t = 0; t < 256; t++)
        for (let e = 0; e < 256; e++) {
          const r = B[t] + B[e],
            i = (t << 8) | e
          ;(A[i] = r), (_[r] = i)
        }
      function I(t) {
        const e = t.length % 2,
          r = t.length - e,
          i = new DataView(t.buffer, t.byteOffset)
        let n = ''
        for (let t = 0; t < r; t += 2) n += A[i.getUint16(t)]
        return e && (n += B[i.getUint8(r)]), n
      }
      const U = /^0x[\da-fA-F]+$/,
        x = /^[\da-fA-F]+$/
      const R =
        'undefined' != typeof globalThis
          ? globalThis
          : 'undefined' != typeof global
          ? global
          : 'undefined' != typeof self
          ? self
          : 'undefined' != typeof window
          ? window
          : Function('return this')
      var T, S
      const L = new ((T = 'TextEncoder'),
      (S = class {
        encode(t) {
          const e = new Uint8Array(t.length)
          for (let r = 0; r < t.length; r++) e[r] = t.charCodeAt(r)
          return e
        }
      }),
      void 0 === R[T] ? S : R[T])()
      function O(t) {
        return t
          ? Array.isArray(t) || M(t)
            ? new Uint8Array(t)
            : b(t)
            ? t
            : (function (t, e = -1, r) {
                return (
                  'string' == typeof t &&
                  ('0x' === t || U.test(t)) &&
                  (-1 === e
                    ? r || t.length % 2 == 0
                    : t.length === 2 + Math.ceil(e / 4))
                )
              })(t)
            ? (function (t, e = -1) {
                if (!t) return new Uint8Array()
                const r = (function (t) {
                    if (!t || '0x' === t) return ''
                    if (U.test(t)) return t.substr(2)
                    if (x.test(t)) return t
                    throw new Error(
                      `Expected hex value to convert, found '${t}'`
                    )
                  })(t).toLowerCase(),
                  i = r.length / 2,
                  n = Math.ceil(-1 === e ? i : e / 8),
                  o = new Uint8Array(n),
                  s = n > i ? n - i : 0,
                  h = new DataView(o.buffer, s),
                  u = (n - s) % 2,
                  a = n - s - u
                for (let t = 0; t < a; t += 2)
                  h.setUint16(t, _[r.substr(2 * t, 4)])
                return u && h.setUint8(a, E[r.substr(r.length - 2, 2)]), o
              })(t)
            : (function (t) {
                return t ? L.encode(t.toString()) : new Uint8Array()
              })(t)
          : new Uint8Array()
      }
      var k = r(406)
      const N = { debug: 'log', error: 'error', log: 'log', warn: 'warn' }
      function $(t) {
        return Array.isArray(t)
          ? t.map($)
          : (function (t) {
              return c.isBN(t)
            })(t)
          ? t.toString()
          : b(t) || M(t)
          ? (function (t, e = -1, r = !0) {
              const i = Math.ceil(e / 8)
              return `${r ? '0x' : ''}${
                t && t.length
                  ? i > 0 && t.length > i
                    ? `${I(t.subarray(0, i / 2))}…${I(
                        t.subarray(t.length - i / 2)
                      )}`
                    : I(t)
                  : ''
              }`
            })(O(t))
          : (function (t) {
              if (
                t &&
                (function (t) {
                  return !!t && 'object' == typeof t
                })(t) &&
                t.constructor === Object
              ) {
                const e = {}
                for (const r of Object.keys(t)) e[r] = $(t[r])
                return e
              }
              return t
            })(t)
      }
      function C(t, e, r, i = -1) {
        if (1 === r.length && 'function' == typeof r[0]) {
          const n = r[0]()
          return C(t, e, Array.isArray(n) ? n : [n], i)
        }
        var n, o
        console[N[t]](
          `${(o = new Date()).getFullYear().toString()}-${l(
            o.getMonth() + 1
          )}-${l(o.getDate())} ${l(o.getHours())}:${l(o.getMinutes())}:${l(
            o.getSeconds()
          )}`,
          e,
          ...r.map($).map(
            ((n = i),
            (t) => {
              if (n <= 0) return t
              const e = `${t}`
              return e.length < n ? t : `${e.substr(0, n)} ...`
            })
          )
        )
      }
      function P() {}
      function j(t, e) {
        return (
          !!t &&
          ('*' === t ||
            e === t ||
            (t.endsWith('*') && e.startsWith(t.slice(0, -1))))
        )
      }
      function q(t, e) {
        return (
          !!t &&
          t.startsWith('-') &&
          (e === t.slice(1) ||
            (t.endsWith('*') && e.startsWith(t.slice(1, -1))))
        )
      }
      function Z(t, e) {
        let r = !1
        for (const i of t) j(i, e) ? (r = !0) : q(i, e) && (r = !1)
        return r
      }
      const F = (function (t) {
        const e = `${t.toUpperCase()}:`.padStart(16),
          [r, i] = (function (t) {
            const e = (w ? k : {}).env || {},
              r = parseInt(e.DEBUG_MAX || '-1', 10)
            return [
              Z((e.DEBUG || '').toLowerCase().split(','), t),
              isNaN(r) ? -1 : r
            ]
          })(t.toLowerCase())
        return {
          debug: r ? (...t) => C('debug', e, t, i) : P,
          error: (...t) => C('error', e, t),
          log: (...t) => C('log', e, t),
          noop: P,
          warn: (...t) => C('warn', e, t)
        }
      })('PostMessageProvider')
      let D, z
      class W {
        #eventemitter
        #isConnected = !1
        #subscriptions = {}
        constructor(t) {
          ;(this.#eventemitter = new (f())()), (D = t)
        }
        clone() {
          return new W(D)
        }
        async connect() {
          console.error('PostMessageProvider.disconnect() is not implemented.')
        }
        async disconnect() {
          console.error('PostMessageProvider.disconnect() is not implemented.')
        }
        get hasSubscriptions() {
          return !0
        }
        get isConnected() {
          return this.#isConnected
        }
        listProviders() {
          return D('pub(rpc.listProviders)', void 0)
        }
        on(t, e) {
          return (
            this.#eventemitter.on(t, e),
            () => {
              this.#eventemitter.removeListener(t, e)
            }
          )
        }
        async send(t, e, r, i) {
          if (i) {
            const { callback: r, type: n } = i,
              o = await D(
                'pub(rpc.subscribe)',
                { method: t, params: e, type: n },
                (t) => {
                  i.callback(null, t)
                }
              )
            return (this.#subscriptions[`${n}::${o}`] = r), o
          }
          return D('pub(rpc.send)', { method: t, params: e })
        }
        async startProvider(t) {
          ;(this.#isConnected = !1), this.#eventemitter.emit('disconnected')
          const e = await D('pub(rpc.startProvider)', t)
          return (
            D(
              'pub(rpc.subscribeConnected)',
              null,
              (t) => (
                (this.#isConnected = t),
                t
                  ? this.#eventemitter.emit('connected')
                  : this.#eventemitter.emit('disconnected'),
                !0
              )
            ),
            e
          )
        }
        subscribe(t, e, r, i) {
          return this.send(e, r, !1, { callback: i, type: t })
        }
        async unsubscribe(t, e, r) {
          const i = `${t}::${r}`
          return void 0 === this.#subscriptions[i]
            ? (F.debug(() => `Unable to find active subscription=${i}`), !1)
            : (delete this.#subscriptions[i], this.send(e, [r]))
        }
      }
      let Y = 0
      class G {
        constructor(t) {
          z = t
        }
        async signPayload(t) {
          const e = ++Y
          return { ...(await z('pub(extrinsic.sign)', t)), id: e }
        }
        async signRaw(t) {
          const e = ++Y
          return { ...(await z('pub(bytes.sign)', t)), id: e }
        }
      }
      const V = {}
      function X(r, i, n) {
        return new Promise((o, h) => {
          const u = `${t}.${Date.now()}.${++s}`
          V[u] = { reject: h, resolve: o, subscriber: n }
          const a = { id: u, message: r, origin: e, request: i || null }
          window.postMessage(a, '*')
        })
      }
      async function K(t) {
        return (
          await X('pub(authorize.tab)', { origin: t }),
          new (class {
            constructor(t) {
              ;(this.accounts = new h(t)),
                (this.metadata = new u(t)),
                (this.provider = new W(t)),
                (this.signer = new G(t))
            }
          })(X)
        )
      }
      function H() {
        !(function (t, { name: e, version: r }) {
          const i = window
          ;(i.injectedWeb3 = i.injectedWeb3 || {}),
            (i.injectedWeb3[e] = { enable: (e) => t(e), version: r })
        })(K, { name: 'polkadot-js', version: '0.42.8-14' })
      }
      window.addEventListener('message', ({ data: t, source: e }) => {
        e === window &&
          t.origin === i &&
          (t.id
            ? (function (t) {
                const e = V[t.id]
                e
                  ? (e.subscriber || delete V[t.id],
                    t.subscription
                      ? e.subscriber(t.subscription)
                      : t.error
                      ? e.reject(new Error(t.error))
                      : e.resolve(t.response))
                  : console.error(`Unknown response: ${JSON.stringify(t)}`)
              })(t)
            : console.error('Missing id for response.'))
      }),
        (async function () {
          return await X('pub(phishing.redirectIfDenied)')
        })()
          .then((t) => {
            t || H()
          })
          .catch((t) => {
            console.warn(
              `Unable to determine if the site is in the phishing list: ${t.message}`
            ),
              H()
          })
    })()
})()
