;(() => {
  'use strict'
  const e = { NODE_ENV: 'production' }.EXTENSION_PREFIX || '',
    n = `${e}content`,
    o = `${e}page`,
    t = `${e}content`,
    d =
      'undefined' != typeof globalThis
        ? globalThis
        : 'undefined' != typeof global
        ? global
        : 'undefined' != typeof self
        ? self
        : 'undefined' != typeof window
        ? window
        : Function('return this'),
    s = ((i = 'chrome'), (a = d.browser), void 0 === d[i] ? a : d[i])
  var i, a
  const r = s.runtime.connect({ name: n })
  r.onMessage.addListener((e) => {
    window.postMessage({ ...e, origin: t }, '*')
  }),
    window.addEventListener('message', ({ data: e, source: n }) => {
      n === window && e.origin === o && r.postMessage(e)
    })
  const c = document.createElement('script')
  ;(c.src = s.extension.getURL('page.js')),
    (c.onload = () => {
      c.parentNode && c.parentNode.removeChild(c)
    }),
    (document.head || document.documentElement).appendChild(c)
})()
