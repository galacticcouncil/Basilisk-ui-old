(this["webpackJsonpbasilisk-ui"]=this["webpackJsonpbasilisk-ui"]||[]).push([[4],{206:function(n,t,e){"use strict";(function(n){e.d(t,"d",(function(){return y})),e.d(t,"b",(function(){return v})),e.d(t,"a",(function(){return h})),e.d(t,"c",(function(){return g}));var r=e(207);let u=0,c=null;function i(){return null!==c&&c.buffer===r.i.buffer||(c=new Uint8Array(r.i.buffer)),c}let o=new("undefined"===typeof TextEncoder?(0,n.require)("util").TextEncoder:TextEncoder)("utf-8");const f="function"===typeof o.encodeInto?function(n,t){return o.encodeInto(n,t)}:function(n,t){const e=o.encode(n);return t.set(e),{read:n.length,written:e.length}};function a(n,t,e){if(void 0===e){const e=o.encode(n),r=t(e.length);return i().subarray(r,r+e.length).set(e),u=e.length,r}let r=n.length,c=t(r);const a=i();let l=0;for(;l<r;l++){const t=n.charCodeAt(l);if(t>127)break;a[c+l]=t}if(l!==r){0!==l&&(n=n.slice(l)),c=e(c,r,r=l+3*n.length);const t=i().subarray(c+l,c+r);l+=f(n,t).written}return u=l,c}let l=null;function d(){return null!==l&&l.buffer===r.i.buffer||(l=new Int32Array(r.i.buffer)),l}let s=new("undefined"===typeof TextDecoder?(0,n.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});function b(n,t){return s.decode(i().subarray(n,n+t))}function y(n,t,e){try{const h=r.a(-16);var c=a(n,r.c,r.d),i=u,o=a(t,r.c,r.d),f=u,l=a(e,r.c,r.d),s=u;r.h(h,c,i,o,f,l,s);var y=d()[h/4+0],v=d()[h/4+1];return b(y,v)}finally{r.a(16),r.b(y,v)}}function v(n,t,e){try{const h=r.a(-16);var c=a(n,r.c,r.d),i=u,o=a(t,r.c,r.d),f=u,l=a(e,r.c,r.d),s=u;r.f(h,c,i,o,f,l,s);var y=d()[h/4+0],v=d()[h/4+1];return b(y,v)}finally{r.a(16),r.b(y,v)}}function h(n,t,e){try{const h=r.a(-16);var c=a(n,r.c,r.d),i=u,o=a(t,r.c,r.d),f=u,l=a(e,r.c,r.d),s=u;r.e(h,c,i,o,f,l,s);var y=d()[h/4+0],v=d()[h/4+1];return b(y,v)}finally{r.a(16),r.b(y,v)}}function g(n,t,e){try{const l=r.a(-16);var c=a(n,r.c,r.d),i=u;r.g(l,c,i,t,e);var o=d()[l/4+0],f=d()[l/4+1];return b(o,f)}finally{r.a(16),r.b(o,f)}}s.decode()}).call(this,e(129)(n))},207:function(n,t,e){"use strict";var r=e.w[n.i];n.exports=r,r.j()},210:function(n,t,e){"use strict";e.r(t);var r=e(206);e.d(t,"get_spot_price",(function(){return r.d})),e.d(t,"calculate_out_given_in",(function(){return r.b})),e.d(t,"calculate_in_given_out",(function(){return r.a})),e.d(t,"calculate_pool_trade_fee",(function(){return r.c}))}}]);
//# sourceMappingURL=4.5f827c34.chunk.js.map