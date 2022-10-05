;(this['webpackJsonpbasilisk-ui'] = this['webpackJsonpbasilisk-ui'] || []).push(
  [
    [0],
    {
      161: function (e, n, t) {},
      182: function (e, n) {},
      192: function (e, n) {},
      216: function (e, n, t) {},
      217: function (e, n, t) {
        'use strict'
        t.r(n)
        var i,
          a,
          r,
          s,
          c = t(2),
          u = t(123),
          o = t.n(u),
          d = (t(161), t(245)),
          l = t(1),
          m = t(16),
          p = t(248),
          v = t(247),
          k = t(5),
          b = t.n(k),
          f = t(13),
          y = t(25),
          j = t.n(y),
          g = t(23),
          N = t(234),
          h = {
            kind: 'Document',
            definitions: [
              {
                kind: 'OperationDefinition',
                operation: 'query',
                name: { kind: 'Name', value: 'GetAccounts' },
                variableDefinitions: [],
                directives: [],
                selectionSet: {
                  kind: 'SelectionSet',
                  selections: [
                    {
                      kind: 'Field',
                      name: { kind: 'Name', value: 'lastBlock' },
                      arguments: [],
                      directives: [
                        {
                          kind: 'Directive',
                          name: { kind: 'Name', value: 'client' },
                          arguments: []
                        }
                      ],
                      selectionSet: {
                        kind: 'SelectionSet',
                        selections: [
                          {
                            kind: 'Field',
                            name: {
                              kind: 'Name',
                              value: 'parachainBlockNumber'
                            },
                            arguments: [],
                            directives: []
                          },
                          {
                            kind: 'Field',
                            name: {
                              kind: 'Name',
                              value: 'relaychainBlockNumber'
                            },
                            arguments: [],
                            directives: []
                          }
                        ]
                      }
                    },
                    {
                      kind: 'Field',
                      name: { kind: 'Name', value: 'accounts' },
                      arguments: [],
                      directives: [
                        {
                          kind: 'Directive',
                          name: { kind: 'Name', value: 'client' },
                          arguments: []
                        }
                      ],
                      selectionSet: {
                        kind: 'SelectionSet',
                        selections: [
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'id' },
                            arguments: [],
                            directives: []
                          },
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'name' },
                            arguments: [],
                            directives: []
                          },
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'isActive' },
                            arguments: [],
                            directives: []
                          },
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'balances' },
                            arguments: [],
                            directives: [],
                            selectionSet: {
                              kind: 'SelectionSet',
                              selections: [
                                {
                                  kind: 'Field',
                                  name: { kind: 'Name', value: 'assetId' },
                                  arguments: [],
                                  directives: []
                                },
                                {
                                  kind: 'Field',
                                  name: { kind: 'Name', value: 'balance' },
                                  arguments: [],
                                  directives: []
                                }
                              ]
                            }
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ],
            loc: {
              start: 0,
              end: 260,
              source: {
                body: '\nquery GetAccounts {\n    lastBlock @client {\n        parachainBlockNumber,\n        relaychainBlockNumber\n    }\n    \n    accounts @client {\n        id,\n        name,\n        isActive,\n        balances {\n            assetId,\n            balance\n        }\n    }\n}',
                name: 'GraphQL request',
                locationOffset: { line: 1, column: 1 }
              }
            }
          },
          O = t(79),
          x = { id: void 0 },
          A = Object(O.a)('basilisk-active-account'),
          S = function () {
            return A(x)
          },
          T = function () {
            var e = (function () {
              var e = S(),
                n = Object(l.a)(e, 2),
                t = (n[0], n[1])
              return Object(c.useCallback)(
                (function () {
                  var e = Object(f.a)(
                    b.a.mark(function e(n, i) {
                      var a, r, s, c
                      return b.a.wrap(function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              if (
                                null ===
                                  (r =
                                    null === (a = n.cache) || void 0 === a
                                      ? void 0
                                      : a.readQuery({ query: h })) ||
                                void 0 === r
                                  ? void 0
                                  : r.accounts
                              ) {
                                e.next = 3
                                break
                              }
                              return e.abrupt('return')
                            case 3:
                              return (
                                (s = r.accounts.map(function (e) {
                                  return Object(m.a)(
                                    Object(m.a)({}, e),
                                    {},
                                    { isActive: e.id === i }
                                  )
                                })),
                                (c = Object(g.find)(s, { isActive: !0 })),
                                t({
                                  id: null === c || void 0 === c ? void 0 : c.id
                                }),
                                s.forEach(function (e) {
                                  n.cache.modify({
                                    id: n.cache.identify({
                                      __typename: e.__typename,
                                      id: e.id
                                    }),
                                    fields: {
                                      isActive: function (n) {
                                        return e.isActive
                                      }
                                    }
                                  })
                                }),
                                (e.next = 9),
                                new Promise(function (e) {
                                  return setTimeout(e, 0)
                                })
                              )
                            case 9:
                              return e.abrupt('return', s)
                            case 10:
                            case 'end':
                              return e.stop()
                          }
                      }, e)
                    })
                  )
                  return function (n, t) {
                    return e.apply(this, arguments)
                  }
                })(),
                [t]
              )
            })()
            return B(
              Object(c.useCallback)(
                (function () {
                  var n = Object(f.a)(
                    b.a.mark(function n(t, i, a) {
                      var r
                      return b.a.wrap(function (n) {
                        for (;;)
                          switch ((n.prev = n.next)) {
                            case 0:
                              return (
                                (r = a.client), n.abrupt('return', e(r, i.id))
                              )
                            case 2:
                            case 'end':
                              return n.stop()
                          }
                      }, n)
                    })
                  )
                  return function (e, t, i) {
                    return n.apply(this, arguments)
                  }
                })(),
                [e]
              ),
              'setActiveAccount'
            )
          },
          B = function (e, n) {
            var t = Object(c.useRef)(e)
            return (
              Object(c.useEffect)(
                function () {
                  t.current = e
                },
                [e]
              ),
              function () {
                return (
                  j.a.debug('Running resolver', n),
                  t.current.apply(void 0, arguments)
                )
              }
            )
          },
          I = t(249),
          w = t(246),
          D = t(43),
          P = { tokens: { AccountData: 'OrmlAccountData' } },
          F = [
            {
              AssetPair: { asset_in: 'AssetId', asset_out: 'AssetId' },
              Amount: 'i128',
              AmountOf: 'Amount',
              Address: 'AccountId',
              OrmlAccountData: {
                free: 'Balance',
                frozen: 'Balance',
                reserved: 'Balance'
              },
              Fee: { numerator: 'u32', denominator: 'u32' },
              BalanceInfo: { amount: 'Balance', assetId: 'AssetId' },
              Chain: { genesisHash: 'Vec<u8>', lastBlockHash: 'Vec<u8>' },
              Currency: 'AssetId',
              CurrencyId: 'AssetId',
              CurrencyIdOf: 'AssetId',
              Intention: {
                who: 'AccountId',
                asset_sell: 'AssetId',
                asset_buy: 'AssetId',
                amount: 'Balance',
                discount: 'bool',
                sell_or_buy: 'IntentionType'
              },
              IntentionId: 'Hash',
              IntentionType: { _enum: ['SELL', 'BUY'] },
              LookupSource: 'AccountId',
              Price: 'Balance',
              ClassId: 'u64',
              TokenId: 'u64',
              ClassData: { is_pool: 'bool' },
              TokenData: { locked: 'bool' },
              ClassInfo: {
                metadata: 'Vec<u8>',
                total_issuance: 'TokenId',
                owner: 'AccountId',
                data: 'ClassData'
              },
              TokenInfo: {
                metadata: 'Vec<u8>',
                owner: 'AccountId',
                data: 'TokenData'
              },
              ClassInfoOf: 'ClassInfo',
              TokenInfoOf: 'TokenInfo',
              ClassIdOf: 'ClassId',
              TokenIdOf: 'TokenId',
              OrderedSet: 'Vec<AssetId>',
              VestingSchedule: {
                start: 'BlockNumber',
                period: 'BlockNumber',
                period_count: 'u32',
                per_period: 'Compact<Balance>'
              },
              VestingScheduleOf: 'VestingSchedule',
              LBPWeight: 'u32',
              WeightCurveType: { _enum: ['Linear'] },
              PoolId: 'AccountId',
              BalanceOf: 'Balance',
              AssetType: {
                _enum: { Token: 'Null', PoolShare: '(AssetId,AssetId)' }
              },
              Pool: {
                owner: 'AccountId',
                start: 'BlockNumber',
                end: 'BlockNumber',
                assets: 'AssetPair',
                initial_weight: 'LBPWeight',
                final_weight: 'LBPWeight',
                weight_curve: 'WeightCurveType',
                fee: 'Fee',
                fee_collector: 'AccountId'
              },
              AssetDetails: {
                name: 'Vec<u8>',
                asset_type: 'AssetType',
                existential_deposit: 'Balance',
                locked: 'bool'
              },
              AssetDetailsT: 'AssetDetails',
              AssetMetadata: { symbol: 'Vec<u8>', decimals: 'u8' },
              AssetInstance: 'AssetInstanceV1',
              MultiLocation: 'MultiLocationV1',
              AssetNativeLocation: 'MultiLocation',
              MultiAsset: 'MultiAssetV1',
              Xcm: 'XcmV1',
              XcmOrder: 'XcmOrderV1'
            }
          ],
          V = {
            nodeUrl: 'ws://localhost:9988',
            processorUrl: '/graphql',
            appName: 'Basilisk UI'
          },
          q = Object(O.a)('basilisk-config'),
          C = function () {
            return q(V)
          },
          _ = t(101),
          L = {
            description: 'Get pool account id by asset IDs',
            params: [
              { name: 'assetAId', type: 'u32' },
              { name: 'assetBId', type: 'u32' }
            ],
            type: 'AccountId'
          },
          E = { xyk: { getPoolAccount: L }, lbp: { getPoolAccount: L } },
          Q = Object(D.a)(function () {
            var e = C(),
              n = Object(l.a)(e, 1)[0].nodeUrl,
              t = Object(c.useState)(void 0),
              i = Object(l.a)(t, 2),
              a = i[0],
              r = i[1],
              s = Object(c.useMemo)(
                function () {
                  return !a
                },
                [a]
              ),
              u = Object(c.useMemo)(
                function () {
                  return new I.a(n)
                },
                [n]
              ),
              o = Object(c.useMemo)(function () {
                return Object(m.a)(Object(m.a)({}, F[0]), _.types)
              }, []),
              d = Object(c.useMemo)(function () {
                return Object(m.a)(Object(m.a)({}, P), _.typesAlias)
              }, [])
            return (
              Object(c.useEffect)(
                function () {
                  return (
                    Object(f.a)(
                      b.a.mark(function e() {
                        var n
                        return b.a.wrap(function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (
                                  r(void 0),
                                  (e.next = 3),
                                  w.a.create({
                                    provider: u,
                                    types: o,
                                    typesAlias: d,
                                    rpc: E
                                  })
                                )
                              case 3:
                                return (n = e.sent), (e.next = 6), n.isReady
                              case 6:
                                r(n)
                              case 7:
                              case 'end':
                                return e.stop()
                            }
                        }, e)
                      })
                    )(),
                    function () {
                      null === a || void 0 === a || a.disconnect()
                    }
                  )
                },
                [u]
              ),
              { apiInstance: a, loading: s }
            )
          }),
          G = Object(l.a)(Q, 2),
          W = G[0],
          M = G[1],
          X = '0',
          U = function () {
            var e = (function () {
                var e = M(),
                  n = e.apiInstance,
                  t = e.loading,
                  i = Object(c.useCallback)(
                    (function () {
                      var e = Object(f.a)(
                        b.a.mark(function e(t, i) {
                          var a, r, s, c
                          return b.a.wrap(function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  if (n && t) {
                                    e.next = 2
                                    break
                                  }
                                  return e.abrupt('return')
                                case 2:
                                  if (
                                    ((r = []), i && !Object(g.includes)(i, X))
                                  ) {
                                    e.next = 8
                                    break
                                  }
                                  return (e.next = 6), n.query.system.account(t)
                                case 6:
                                  ;(s = e.sent),
                                    r.push({
                                      assetId: X,
                                      balance:
                                        null === s || void 0 === s
                                          ? void 0
                                          : s.data.free.toString()
                                    })
                                case 8:
                                  if (
                                    !(i = i
                                      ? i.filter(function (e) {
                                          return e !== X
                                        })
                                      : i)
                                  ) {
                                    e.next = 15
                                    break
                                  }
                                  return (
                                    (e.next = 12),
                                    n.query.tokens.accounts.multi(
                                      null === (a = i) || void 0 === a
                                        ? void 0
                                        : a.map(function (e) {
                                            return [t, e]
                                          })
                                    )
                                  )
                                case 12:
                                  ;(e.t0 = e.sent.map(function (e, n) {
                                    return { assetId: i[n], balance: e }
                                  })),
                                    (e.next = 18)
                                  break
                                case 15:
                                  return (
                                    (e.next = 17),
                                    n.query.tokens.accounts.entries(t)
                                  )
                                case 17:
                                  e.t0 = e.sent.map(function (e) {
                                    var n = Object(l.a)(e, 2),
                                      t = n[0],
                                      i = n[1]
                                    return {
                                      assetId: t.toHuman()[1],
                                      balance: i
                                    }
                                  })
                                case 18:
                                  return (
                                    null === (c = e.t0) ||
                                      void 0 === c ||
                                      c.forEach(function (e) {
                                        var t =
                                          null === n || void 0 === n
                                            ? void 0
                                            : n
                                                .createType(
                                                  'AccountData',
                                                  e.balance
                                                )
                                                .free.toString()
                                        r.push({
                                          assetId: e.assetId,
                                          balance: t
                                        })
                                      }),
                                    e.abrupt('return', r)
                                  )
                                case 21:
                                case 'end':
                                  return e.stop()
                              }
                          }, e)
                        })
                      )
                      return function (n, t) {
                        return e.apply(this, arguments)
                      }
                    })(),
                    [n, t]
                  )
                return i
              })(),
              n = B(
                Object(c.useCallback)(
                  (function () {
                    var n = Object(f.a)(
                      b.a.mark(function n(t, i) {
                        var a, r
                        return b.a.wrap(function (n) {
                          for (;;)
                            switch ((n.prev = n.next)) {
                              case 0:
                                return (
                                  ('LBPPool' !== t.__typename &&
                                    'XYKPool' !== t.__typename) ||
                                    (r = [(t = t).assetAId, t.assetBId]),
                                  (n.next = 3),
                                  e(t.id, r)
                                )
                              case 3:
                                if (
                                  ((n.t1 = a = n.sent),
                                  (n.t0 = null === n.t1),
                                  n.t0)
                                ) {
                                  n.next = 7
                                  break
                                }
                                n.t0 = void 0 === a
                              case 7:
                                if (!n.t0) {
                                  n.next = 11
                                  break
                                }
                                ;(n.t2 = void 0), (n.next = 12)
                                break
                              case 11:
                                n.t2 = a.map(function (e) {
                                  return Object(m.a)(
                                    Object(m.a)({}, e),
                                    {},
                                    {
                                      __typename: 'Balance',
                                      id: ''.concat(t.id, '-').concat(e.assetId)
                                    }
                                  )
                                })
                              case 12:
                                return n.abrupt('return', n.t2)
                              case 13:
                              case 'end':
                                return n.stop()
                            }
                        }, n)
                      })
                    )
                    return function (e, t) {
                      return n.apply(this, arguments)
                    }
                  })(),
                  [e]
                ),
                'balances'
              )
            return { balances: n }
          },
          H = function () {
            var e = (function () {
                var e = M(),
                  n = e.apiInstance,
                  t = e.loading,
                  i = Object(c.useCallback)(
                    (function () {
                      var e = Object(f.a)(
                        b.a.mark(function e(t) {
                          var i, a
                          return b.a.wrap(function (e) {
                            for (;;)
                              switch ((e.prev = e.next)) {
                                case 0:
                                  if (n && t) {
                                    e.next = 2
                                    break
                                  }
                                  return e.abrupt('return')
                                case 2:
                                  return (
                                    (e.t0 = g.first),
                                    (e.t1 = n),
                                    (e.t2 = 'Vec<VestingScheduleOf>'),
                                    (e.next = 7),
                                    n.query.vesting.vestingSchedules(t)
                                  )
                                case 7:
                                  return (
                                    (e.t3 = e.sent),
                                    (e.t4 = e.t1.createType.call(
                                      e.t1,
                                      e.t2,
                                      e.t3
                                    )),
                                    (i = (0, e.t0)(e.t4)),
                                    (e.t5 = g.find),
                                    (e.t6 = n),
                                    (e.t7 = 'Vec<BalanceLock>'),
                                    (e.next = 15),
                                    n.query.balances.locks(t)
                                  )
                                case 15:
                                  return (
                                    (e.t8 = e.sent),
                                    (e.t9 = e.t6.createType.call(
                                      e.t6,
                                      e.t7,
                                      e.t8
                                    )),
                                    (e.t10 = function (e) {
                                      return e.id.eq('ormlvest')
                                    }),
                                    (a = (0, e.t5)(e.t9, e.t10)),
                                    e.abrupt('return', {
                                      remainingVestingAmount:
                                        null === a || void 0 === a
                                          ? void 0
                                          : a.amount.toString(),
                                      start:
                                        null === i || void 0 === i
                                          ? void 0
                                          : i.start.toString(),
                                      period:
                                        null === i || void 0 === i
                                          ? void 0
                                          : i.period.toString(),
                                      periodCount:
                                        null === i || void 0 === i
                                          ? void 0
                                          : i.periodCount.toString(),
                                      perPeriod:
                                        null === i || void 0 === i
                                          ? void 0
                                          : i.perPeriod.toString()
                                    })
                                  )
                                case 20:
                                case 'end':
                                  return e.stop()
                              }
                          }, e)
                        })
                      )
                      return function (n) {
                        return e.apply(this, arguments)
                      }
                    })(),
                    [n, t]
                  )
                return i
              })(),
              n = B(
                Object(c.useCallback)(
                  (function () {
                    var n = Object(f.a)(
                      b.a.mark(function n(t) {
                        return b.a.wrap(function (n) {
                          for (;;)
                            switch ((n.prev = n.next)) {
                              case 0:
                                return (n.next = 2), e(t.id)
                              case 2:
                                return n.abrupt('return', n.sent)
                              case 3:
                              case 'end':
                                return n.stop()
                            }
                        }, n)
                      })
                    )
                    return function (e) {
                      return n.apply(this, arguments)
                    }
                  })(),
                  [e]
                ),
                'vestingSchedule'
              )
            return { vestingSchedule: n }
          },
          Y = t(28),
          $ = t(252),
          K = t(138),
          R = 'Account',
          z = function () {
            var e = S(),
              n = Object(l.a)(e, 1)[0],
              t = Object(c.useCallback)(
                (function () {
                  var e = Object(f.a)(
                    b.a.mark(function e(n, t) {
                      var i, a
                      return b.a.wrap(function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              return (e.next = 2), Object(Y.b)('basilisk-ui')
                            case 2:
                              return (e.next = 4), Object(Y.a)()
                            case 4:
                              if (
                                ((i = e.sent
                                  .map(function (e) {
                                    return {
                                      id: Object($.a)(
                                        Object(K.a)(e.address),
                                        10041
                                      ),
                                      name: e.meta.name,
                                      isActive: !1
                                    }
                                  })
                                  .map(function (e) {
                                    return Object(m.a)(
                                      Object(m.a)({}, e),
                                      {},
                                      { isActive: n == e.id }
                                    )
                                  })),
                                !t)
                              ) {
                                e.next = 8
                                break
                              }
                              return (
                                (a = Object(g.find)(i, { isActive: t })),
                                e.abrupt('return', a)
                              )
                            case 8:
                              return e.abrupt('return', i)
                            case 9:
                            case 'end':
                              return e.stop()
                          }
                      }, e)
                    })
                  )
                  return function (n, t) {
                    return e.apply(this, arguments)
                  }
                })(),
                []
              )
            return B(
              Object(c.useCallback)(
                (function () {
                  var e = Object(f.a)(
                    b.a.mark(function e(i, a) {
                      var r
                      return b.a.wrap(function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              return (
                                (e.next = 2),
                                t(
                                  null === n || void 0 === n ? void 0 : n.id,
                                  null === a || void 0 === a
                                    ? void 0
                                    : a.isActive
                                )
                              )
                            case 2:
                              if ((r = e.sent)) {
                                e.next = 5
                                break
                              }
                              return e.abrupt('return', null)
                            case 5:
                              return e.abrupt(
                                'return',
                                Object(g.isArray)(r)
                                  ? r.map(function (e) {
                                      return Object(m.a)(
                                        Object(m.a)({}, e),
                                        {},
                                        { __typename: R }
                                      )
                                    })
                                  : Object(m.a)(
                                      Object(m.a)({}, r),
                                      {},
                                      { __typename: R }
                                    )
                              )
                            case 7:
                            case 'end':
                              return e.stop()
                          }
                      }, e)
                    })
                  )
                  return function (n, t) {
                    return e.apply(this, arguments)
                  }
                })(),
                [n, t]
              ),
              'accounts'
            )
          },
          J = {
            kind: 'Document',
            definitions: [
              {
                kind: 'OperationDefinition',
                operation: 'query',
                name: { kind: 'Name', value: 'GetLastBlock' },
                variableDefinitions: [],
                directives: [],
                selectionSet: {
                  kind: 'SelectionSet',
                  selections: [
                    {
                      kind: 'Field',
                      name: { kind: 'Name', value: 'lastBlock' },
                      arguments: [],
                      directives: [
                        {
                          kind: 'Directive',
                          name: { kind: 'Name', value: 'client' },
                          arguments: []
                        }
                      ],
                      selectionSet: {
                        kind: 'SelectionSet',
                        selections: [
                          {
                            kind: 'Field',
                            name: {
                              kind: 'Name',
                              value: 'parachainBlockNumber'
                            },
                            arguments: [],
                            directives: []
                          },
                          {
                            kind: 'Field',
                            name: {
                              kind: 'Name',
                              value: 'relaychainBlockNumber'
                            },
                            arguments: [],
                            directives: []
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ],
            loc: {
              start: 0,
              end: 112,
              source: {
                body: 'query GetLastBlock {\n    lastBlock @client {\n        parachainBlockNumber,\n        relaychainBlockNumber\n    }\n}',
                name: 'GraphQL request',
                locationOffset: { line: 1, column: 1 }
              }
            }
          },
          Z = Object(D.a)(function () {
            var e = M(),
              n = e.apiInstance,
              t = e.loading,
              i = Object(c.useState)(void 0),
              a = Object(l.a)(i, 2),
              r = a[0],
              s = a[1],
              u = Object(c.useCallback)(
                function () {
                  n &&
                    n.derive.chain.subscribeNewBlocks(
                      (function () {
                        var e = Object(f.a)(
                          b.a.mark(function e(t) {
                            var i, a, r
                            return b.a.wrap(function (e) {
                              for (;;)
                                switch ((e.prev = e.next)) {
                                  case 0:
                                    return (
                                      (e.next = 2),
                                      n.query.parachainSystem.validationData()
                                    )
                                  case 2:
                                    ;(i = e.sent),
                                      (a = n.createType(
                                        'Option<PolkadotPrimitivesV1PersistedValidationData>',
                                        i
                                      )).isSome &&
                                        ((r = a.toJSON()),
                                        s({
                                          parachainBlockNumber:
                                            t.block.header.number.toString(),
                                          relaychainBlockNumber:
                                            r.relayParentNumber.toString()
                                        }))
                                  case 5:
                                  case 'end':
                                    return e.stop()
                                }
                            }, e)
                          })
                        )
                        return function (n) {
                          return e.apply(this, arguments)
                        }
                      })()
                    )
                },
                [n]
              )
            return (
              Object(c.useEffect)(
                function () {
                  t || u()
                },
                [t, u]
              ),
              r
            )
          }),
          ee = Object(l.a)(Z, 2),
          ne = ee[0],
          te = ee[1],
          ie = 'LastBlock',
          ae = ie,
          re = function (e, n) {
            return e.writeQuery({ query: J, data: { lastBlock: n } })
          },
          se = t(239),
          ce = {
            kind: 'Document',
            definitions: [
              {
                kind: 'OperationDefinition',
                operation: 'query',
                name: { kind: 'Name', value: 'GetConfig' },
                variableDefinitions: [],
                directives: [],
                selectionSet: {
                  kind: 'SelectionSet',
                  selections: [
                    {
                      kind: 'Field',
                      name: { kind: 'Name', value: 'lastBlock' },
                      arguments: [],
                      directives: [
                        {
                          kind: 'Directive',
                          name: { kind: 'Name', value: 'client' },
                          arguments: []
                        }
                      ],
                      selectionSet: {
                        kind: 'SelectionSet',
                        selections: [
                          {
                            kind: 'Field',
                            name: {
                              kind: 'Name',
                              value: 'parachainBlockNumber'
                            },
                            arguments: [],
                            directives: []
                          }
                        ]
                      }
                    },
                    {
                      kind: 'Field',
                      name: { kind: 'Name', value: 'config' },
                      arguments: [],
                      directives: [
                        {
                          kind: 'Directive',
                          name: { kind: 'Name', value: 'client' },
                          arguments: []
                        }
                      ],
                      selectionSet: {
                        kind: 'SelectionSet',
                        selections: [
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'nodeUrl' },
                            arguments: [],
                            directives: []
                          },
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'processorUrl' },
                            arguments: [],
                            directives: []
                          },
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'appName' },
                            arguments: [],
                            directives: []
                          },
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'feePaymentAsset' },
                            arguments: [],
                            directives: []
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ],
            loc: {
              start: 0,
              end: 188,
              source: {
                body: 'query GetConfig {\n    lastBlock @client {\n        parachainBlockNumber\n    },\n\n    config @client {\n        nodeUrl,\n        processorUrl,\n        appName,\n        feePaymentAsset,\n    }\n}',
                name: 'GraphQL request',
                locationOffset: { line: 1, column: 1 }
              }
            }
          },
          ue = {
            kind: 'Document',
            definitions: [
              {
                kind: 'OperationDefinition',
                operation: 'query',
                name: { kind: 'Name', value: 'GetActiveAccount' },
                variableDefinitions: [],
                directives: [],
                selectionSet: {
                  kind: 'SelectionSet',
                  selections: [
                    {
                      kind: 'Field',
                      name: { kind: 'Name', value: 'lastBlock' },
                      arguments: [],
                      directives: [
                        {
                          kind: 'Directive',
                          name: { kind: 'Name', value: 'client' },
                          arguments: []
                        }
                      ],
                      selectionSet: {
                        kind: 'SelectionSet',
                        selections: [
                          {
                            kind: 'Field',
                            name: {
                              kind: 'Name',
                              value: 'parachainBlockNumber'
                            },
                            arguments: [],
                            directives: []
                          },
                          {
                            kind: 'Field',
                            name: {
                              kind: 'Name',
                              value: 'relaychainBlockNumber'
                            },
                            arguments: [],
                            directives: []
                          }
                        ]
                      }
                    },
                    {
                      kind: 'Field',
                      alias: { kind: 'Name', value: 'account' },
                      name: { kind: 'Name', value: 'accounts' },
                      arguments: [
                        {
                          kind: 'Argument',
                          name: { kind: 'Name', value: 'isActive' },
                          value: { kind: 'BooleanValue', value: !0 }
                        }
                      ],
                      directives: [
                        {
                          kind: 'Directive',
                          name: { kind: 'Name', value: 'client' },
                          arguments: []
                        }
                      ],
                      selectionSet: {
                        kind: 'SelectionSet',
                        selections: [
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'id' },
                            arguments: [],
                            directives: []
                          },
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'name' },
                            arguments: [],
                            directives: []
                          },
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'isActive' },
                            arguments: [],
                            directives: []
                          },
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'balances' },
                            arguments: [],
                            directives: [],
                            selectionSet: {
                              kind: 'SelectionSet',
                              selections: [
                                {
                                  kind: 'Field',
                                  name: { kind: 'Name', value: 'assetId' },
                                  arguments: [],
                                  directives: []
                                },
                                {
                                  kind: 'Field',
                                  name: { kind: 'Name', value: 'balance' },
                                  arguments: [],
                                  directives: []
                                }
                              ]
                            }
                          },
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'vestingSchedule' },
                            arguments: [],
                            directives: [],
                            selectionSet: {
                              kind: 'SelectionSet',
                              selections: [
                                {
                                  kind: 'Field',
                                  name: {
                                    kind: 'Name',
                                    value: 'remainingVestingAmount'
                                  },
                                  arguments: [],
                                  directives: []
                                },
                                {
                                  kind: 'Field',
                                  name: { kind: 'Name', value: 'start' },
                                  arguments: [],
                                  directives: []
                                },
                                {
                                  kind: 'Field',
                                  name: { kind: 'Name', value: 'period' },
                                  arguments: [],
                                  directives: []
                                },
                                {
                                  kind: 'Field',
                                  name: { kind: 'Name', value: 'periodCount' },
                                  arguments: [],
                                  directives: []
                                },
                                {
                                  kind: 'Field',
                                  name: { kind: 'Name', value: 'perPeriod' },
                                  arguments: [],
                                  directives: []
                                }
                              ]
                            }
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ],
            loc: {
              start: 0,
              end: 607,
              source: {
                body: '# TODO: fetch only balances for the active fee payment asset\nquery GetActiveAccount {\n    lastBlock @client { \n        parachainBlockNumber,\n        relaychainBlockNumber,\n    }\n    \n    account: accounts(isActive: true) @client {\n        id,\n        name,\n        isActive,\n        balances {\n            assetId,\n            balance\n        },\n        vestingSchedule {\n            # figure out why this fragment doesnt work\n            # ...VestingScheduleFields,\n            remainingVestingAmount,\n            start,\n            period,\n            periodCount,\n            perPeriod\n        }\n    } \n}',
                name: 'GraphQL request',
                locationOffset: { line: 1, column: 1 }
              }
            }
          },
          oe = function () {
            var e,
              n,
              t = Object(se.a)(),
              i = Object(N.a)(ue, { notifyOnNetworkStatusChange: !0 })
            return (
              Object(c.useEffect)(
                function () {
                  t.refetchQueries({ include: [ce] })
                },
                [
                  null === (e = i.data) ||
                  void 0 === e ||
                  null === (n = e.account) ||
                  void 0 === n
                    ? void 0
                    : n.id
                ]
              ),
              i
            )
          },
          de = Object(D.a)(oe),
          le = Object(l.a)(de, 2),
          me =
            (le[0],
            le[1],
            (function () {
              var e = Object(f.a)(
                b.a.mark(function e(n, t) {
                  return b.a.wrap(function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return e.abrupt(
                            'return',
                            new Promise(
                              (function () {
                                var e = Object(f.a)(
                                  b.a.mark(function e(i, a) {
                                    return b.a.wrap(
                                      function (e) {
                                        for (;;)
                                          switch ((e.prev = e.next)) {
                                            case 0:
                                              return (
                                                (e.prev = 0),
                                                (e.t0 = i),
                                                (e.next = 4),
                                                n(i, a)
                                              )
                                            case 4:
                                              ;(e.t1 = e.sent),
                                                (0, e.t0)(e.t1),
                                                (e.next = 13)
                                              break
                                            case 8:
                                              ;(e.prev = 8),
                                                (e.t2 = e.catch(0)),
                                                console.log(
                                                  'graceful error',
                                                  e.t2
                                                ),
                                                (e.t2 = t.reduce(function (
                                                  e,
                                                  n
                                                ) {
                                                  return n(e)
                                                },
                                                e.t2)),
                                                e.t2 ? a(e.t2) : i(null)
                                            case 13:
                                            case 'end':
                                              return e.stop()
                                          }
                                      },
                                      e,
                                      null,
                                      [[0, 8]]
                                    )
                                  })
                                )
                                return function (n, t) {
                                  return e.apply(this, arguments)
                                }
                              })()
                            )
                          )
                        case 1:
                        case 'end':
                          return e.stop()
                      }
                  }, e)
                })
              )
              return function (n, t) {
                return e.apply(this, arguments)
              }
            })()),
          pe = function (e) {
            if (
              'Cancelled' !== (null === e || void 0 === e ? void 0 : e.message)
            )
              return e
            j.a.error(
              'Operation presumably cancelled by the user in the Polkadot.js extension'
            )
          },
          ve = function (e, n, t) {
            return function (i) {
              var a,
                r = i.status,
                s = i.events,
                c = void 0 === s ? [] : s,
                u = i.dispatchError
              return (
                r.isFinalized && j.a.info('operation finalized'),
                c.forEach(function (e) {
                  var n = e.event,
                    t = n.data,
                    i = n.method,
                    a = n.section,
                    r = e.phase
                  console.log(
                    'event handler',
                    r.toString(),
                    ': '.concat(a, '.').concat(i),
                    t.toString()
                  )
                }),
                r.isInBlock
                  ? (console.log(
                      'is in block',
                      null === (a = r.createdAtHash) || void 0 === a
                        ? void 0
                        : a.toString()
                    ),
                    (null === u || void 0 === u ? void 0 : u.isModule)
                      ? j.a.info(
                          'operation unsuccessful',
                          t ? t.registry.findMetaError(u.asModule) : u
                        )
                      : j.a.info('operation successful'))
                  : r.isBroadcast
                  ? (j.a.info(
                      'transaction has been broadcast',
                      r.hash.toHuman()
                    ),
                    e())
                  : u
                  ? (j.a.error('There was a dispatch error', u),
                    n('Dispatch error'))
                  : void 0
              )
            }
          },
          ke = 'Polkadot.js is not ready yet',
          be = function () {
            var e = M(),
              n = e.apiInstance,
              t = e.loading,
              i = B(
                Object(c.useCallback)(
                  (function () {
                    var e = Object(f.a)(
                      b.a.mark(function e(i, a, r) {
                        var s, c, u, o
                        return b.a.wrap(function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                if (
                                  ((u = r.cache),
                                  (o = (
                                    null === a || void 0 === a
                                      ? void 0
                                      : a.address
                                  )
                                    ? a.address
                                    : null ===
                                        (s = u.readQuery({ query: ue })) ||
                                      void 0 === s ||
                                      null === (c = s.account) ||
                                      void 0 === c
                                    ? void 0
                                    : c.id))
                                ) {
                                  e.next = 4
                                  break
                                }
                                throw new Error('No Account selected')
                              case 4:
                                if (!t && n) {
                                  e.next = 6
                                  break
                                }
                                throw new Error(ke)
                              case 6:
                                return (
                                  (e.next = 8),
                                  me(
                                    (function () {
                                      var e = Object(f.a)(
                                        b.a.mark(function e(t, i) {
                                          var a, r
                                          return b.a.wrap(function (e) {
                                            for (;;)
                                              switch ((e.prev = e.next)) {
                                                case 0:
                                                  return (
                                                    (e.next = 2), Object(Y.c)(o)
                                                  )
                                                case 2:
                                                  return (
                                                    (a = e.sent),
                                                    (r = a.signer),
                                                    (e.next = 6),
                                                    n.tx.vesting
                                                      .claim()
                                                      .signAndSend(
                                                        o,
                                                        { signer: r },
                                                        ve(t, i)
                                                      )
                                                  )
                                                case 6:
                                                case 'end':
                                                  return e.stop()
                                              }
                                          }, e)
                                        })
                                      )
                                      return function (n, t) {
                                        return e.apply(this, arguments)
                                      }
                                    })(),
                                    [pe]
                                  )
                                )
                              case 8:
                                return e.abrupt('return', e.sent)
                              case 9:
                              case 'end':
                                return e.stop()
                            }
                        }, e)
                      })
                    )
                    return function (n, t, i) {
                      return e.apply(this, arguments)
                    }
                  })(),
                  [t, n]
                ),
                'claimVestedAmount'
              )
            return { claimVestedAmount: i }
          },
          fe = function (e, n, t) {
            return function (i) {
              var a = i.status,
                r = i.dispatchError
              return (
                a.isFinalized && j.a.info('operation finalized'),
                a.isInBlock
                  ? (null === r || void 0 === r ? void 0 : r.isModule)
                    ? j.a.error(
                        'transfer unsuccessful',
                        e.registry.findMetaError(r.asModule)
                      )
                    : j.a.info('transfer successful')
                  : a.isBroadcast
                  ? (j.a.info('transaction has been broadcast'), n())
                  : r
                  ? (j.a.error(
                      'There was a dispatch error',
                      e.registry.findMetaError(r.asModule)
                    ),
                    t())
                  : void 0
              )
            }
          },
          ye = function (e) {
            return e.tx.currencies.transfer
          },
          je = function () {
            var e = M(),
              n = e.apiInstance,
              t = e.loading,
              i = B(
                Object(c.useCallback)(
                  (function () {
                    var e = Object(f.a)(
                      b.a.mark(function e(i, a) {
                        var r, s, c, u
                        return b.a.wrap(function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                if (
                                  ((r = a.from),
                                  (s = a.to),
                                  (c = a.currencyId),
                                  (u = a.amount),
                                  r && s && c && u)
                                ) {
                                  e.next = 3
                                  break
                                }
                                throw new Error(
                                  'Invalid transfer parameters provided'
                                )
                              case 3:
                                if (!t && n) {
                                  e.next = 5
                                  break
                                }
                                throw new Error(ke)
                              case 5:
                                return e.abrupt(
                                  'return',
                                  me(
                                    (function () {
                                      var e = Object(f.a)(
                                        b.a.mark(function e(t, i) {
                                          var a, o
                                          return b.a.wrap(function (e) {
                                            for (;;)
                                              switch ((e.prev = e.next)) {
                                                case 0:
                                                  return (
                                                    (e.next = 2), Object(Y.c)(r)
                                                  )
                                                case 2:
                                                  return (
                                                    (a = e.sent),
                                                    (o = a.signer),
                                                    (e.next = 6),
                                                    ye(n)
                                                      .apply(n, [s, c, u])
                                                      .signAndSend(
                                                        r,
                                                        { signer: o },
                                                        fe(n, t, i)
                                                      )
                                                  )
                                                case 6:
                                                case 'end':
                                                  return e.stop()
                                              }
                                          }, e)
                                        })
                                      )
                                      return function (n, t) {
                                        return e.apply(this, arguments)
                                      }
                                    })(),
                                    [pe]
                                  )
                                )
                              case 6:
                              case 'end':
                                return e.stop()
                            }
                        }, e)
                      })
                    )
                    return function (n, t) {
                      return e.apply(this, arguments)
                    }
                  })(),
                  [n, t]
                )
              )
            return { transferBalance: i }
          },
          ge = 'Extension',
          Ne = 'Config',
          he = function () {
            var e = C(),
              n = Object(l.a)(e, 1)[0],
              t = M(),
              i = t.apiInstance,
              a = t.loading,
              r = B(
                Object(c.useCallback)(
                  (function () {
                    var e = Object(f.a)(
                      b.a.mark(function e(t, r, s) {
                        var c, u, o, d, l, p
                        return b.a.wrap(function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                if (((d = s.cache), i && !a)) {
                                  e.next = 3
                                  break
                                }
                                return e.abrupt('return')
                              case 3:
                                if (
                                  !(l =
                                    null === (c = d.readQuery({ query: ue })) ||
                                    void 0 === c ||
                                    null === (u = c.account) ||
                                    void 0 === u
                                      ? void 0
                                      : u.id)
                                ) {
                                  e.next = 22
                                  break
                                }
                                return (
                                  (e.t2 = i),
                                  (e.t3 = 'Option<u32>'),
                                  (e.next = 9),
                                  i.query.multiTransactionPayment.accountCurrencyMap(
                                    l
                                  )
                                )
                              case 9:
                                if (
                                  ((e.t4 = e.sent),
                                  (e.t5 = o =
                                    e.t2.createType.call(e.t2, e.t3, e.t4)),
                                  (e.t1 = null === e.t5),
                                  e.t1)
                                ) {
                                  e.next = 14
                                  break
                                }
                                e.t1 = void 0 === o
                              case 14:
                                if (!e.t1) {
                                  e.next = 18
                                  break
                                }
                                ;(e.t6 = void 0), (e.next = 19)
                                break
                              case 18:
                                e.t6 = o.toHuman()
                              case 19:
                                ;(e.t0 = e.t6), (e.next = 23)
                                break
                              case 22:
                                e.t0 = null
                              case 23:
                                return (
                                  (p = (p = e.t0) || '0'),
                                  e.abrupt(
                                    'return',
                                    Object(m.a)(
                                      Object(m.a)(
                                        { __typename: Ne, id: 'Config' },
                                        n
                                      ),
                                      {},
                                      { feePaymentAsset: p }
                                    )
                                  )
                                )
                              case 26:
                              case 'end':
                                return e.stop()
                            }
                        }, e)
                      })
                    )
                    return function (n, t, i) {
                      return e.apply(this, arguments)
                    }
                  })(),
                  [i, a]
                )
              )
            return { config: r }
          },
          Oe = function (e, n) {
            return ve(e, n)
          },
          xe = function () {
            var e = M(),
              n = e.apiInstance,
              t = e.loading,
              i = C(),
              a = Object(l.a)(i, 2),
              r = (a[0], a[1]),
              s = B(
                Object(c.useCallback)(
                  (function () {
                    var e = Object(f.a)(
                      b.a.mark(function e(i, a, s) {
                        var c, u
                        return b.a.wrap(function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                if (((c = s.cache), n && !t)) {
                                  e.next = 3
                                  break
                                }
                                return e.abrupt('return')
                              case 3:
                                return (
                                  (e.next = 5),
                                  me(
                                    (function () {
                                      var e = Object(f.a)(
                                        b.a.mark(function e(t, i) {
                                          var r, s, u, o, d, l
                                          return b.a.wrap(function (e) {
                                            for (;;)
                                              switch ((e.prev = e.next)) {
                                                case 0:
                                                  if (
                                                    (o =
                                                      null ===
                                                        (r = c.readQuery({
                                                          query: ue
                                                        })) ||
                                                      void 0 === r ||
                                                      null ===
                                                        (s = r.account) ||
                                                      void 0 === s
                                                        ? void 0
                                                        : s.id)
                                                  ) {
                                                    e.next = 3
                                                    break
                                                  }
                                                  return e.abrupt('return', t())
                                                case 3:
                                                  return (
                                                    (e.next = 5), Object(Y.c)(o)
                                                  )
                                                case 5:
                                                  return (
                                                    (d = e.sent),
                                                    (l = d.signer),
                                                    (e.next = 9),
                                                    n.tx.multiTransactionPayment
                                                      .setCurrency(
                                                        (null ===
                                                          (u = a.config) ||
                                                        void 0 === u
                                                          ? void 0
                                                          : u.feePaymentAsset) ||
                                                          '0'
                                                      )
                                                      .signAndSend(
                                                        o,
                                                        { signer: l },
                                                        Oe(t, i)
                                                      )
                                                  )
                                                case 9:
                                                case 'end':
                                                  return e.stop()
                                              }
                                          }, e)
                                        })
                                      )
                                      return function (n, t) {
                                        return e.apply(this, arguments)
                                      }
                                    })(),
                                    [pe]
                                  )
                                )
                              case 5:
                                null === (u = a.config) ||
                                  void 0 === u ||
                                  delete u.feePaymentAsset,
                                  r(function () {
                                    return u || V
                                  })
                              case 8:
                              case 'end':
                                return e.stop()
                            }
                        }, e)
                      })
                    )
                    return function (n, t, i) {
                      return e.apply(this, arguments)
                    }
                  })(),
                  [n, t]
                )
              )
            return { setConfig: s }
          },
          Ae = function () {
            var e = M(),
              n = e.apiInstance,
              t = e.loading
            return {
              feePaymentAssets: B(
                Object(c.useCallback)(
                  Object(f.a)(
                    b.a.mark(function e() {
                      var i, a
                      return b.a.wrap(function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              if (n && !t) {
                                e.next = 2
                                break
                              }
                              return e.abrupt('return')
                            case 2:
                              return (
                                (e.next = 4),
                                n.query.multiTransactionPayment.acceptedCurrencies.entries()
                              )
                            case 4:
                              return (
                                (i = e.sent),
                                (a = i.map(function (e) {
                                  var n = e[0].toHuman()[0]
                                  return {
                                    __typename: 'FeePaymentAsset',
                                    id: n,
                                    assetId: n,
                                    fallbackPrice: e[1].toString()
                                  }
                                })),
                                e.abrupt('return', a)
                              )
                            case 7:
                            case 'end':
                              return e.stop()
                          }
                      }, e)
                    })
                  ),
                  [n, t]
                )
              )
            }
          },
          Se = function (e) {
            var n = Object(l.a)(e, 2),
              t = n[0],
              i = n[1]
            return [t.toHuman()[0], i]
          },
          Te = function (e) {
            return function (e) {
              var n = Object(l.a)(e, 2),
                t = n[0],
                i = n[1].toHuman()
              if (i) return { id: t, assetAId: i[0], assetBId: i[1] }
            }
          },
          Be = function (e) {
            return function (e) {
              var n = Object(l.a)(e, 2),
                t = n[0],
                i = n[1].toHuman()
              if (i)
                return { id: t, assetAId: i.assets[0], assetBId: i.assets[1] }
            }
          },
          Ie = (function () {
            var e = Object(f.a)(
              b.a.mark(function e(n, t) {
                var i, a
                return b.a.wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (e.next = 2), n.rpc.lbp.getPoolAccount(t[0], t[1])
                        )
                      case 2:
                        return (
                          (i = e.sent.toHuman()),
                          (e.next = 5),
                          n.rpc.xyk.getPoolAccount(t[0], t[1])
                        )
                      case 5:
                        return (
                          (a = e.sent.toHuman()),
                          e.abrupt('return', { lbpPoolId: i, xykPoolId: a })
                        )
                      case 7:
                      case 'end':
                        return e.stop()
                    }
                }, e)
              })
            )
            return function (n, t) {
              return e.apply(this, arguments)
            }
          })(),
          we = function () {
            var e = M(),
              n = e.apiInstance,
              t = e.loading,
              i = (function () {
                var e = M(),
                  n = e.apiInstance,
                  t = e.loading
                return Object(c.useCallback)(
                  Object(f.a)(
                    b.a.mark(function e() {
                      return b.a.wrap(function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              if (n && !t) {
                                e.next = 2
                                break
                              }
                              return e.abrupt('return', [])
                            case 2:
                              return (
                                (e.next = 4), n.query.lbp.poolData.entries()
                              )
                            case 4:
                              if (((e.t0 = e.sent.map(Se).map(Be())), e.t0)) {
                                e.next = 7
                                break
                              }
                              e.t0 = []
                            case 7:
                              return e.abrupt('return', e.t0)
                            case 8:
                            case 'end':
                              return e.stop()
                          }
                      }, e)
                    })
                  ),
                  [n, t]
                )
              })(),
              a = (function () {
                var e = M(),
                  n = e.apiInstance,
                  t = e.loading
                return Object(c.useCallback)(
                  (function () {
                    var e = Object(f.a)(
                      b.a.mark(function e(i, a) {
                        return b.a.wrap(function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                if (n && !t) {
                                  e.next = 2
                                  break
                                }
                                return e.abrupt('return', [])
                              case 2:
                                if (!i) {
                                  e.next = 7
                                  break
                                }
                                return (e.next = 5), n.query.xyk.poolAssets(i)
                              case 5:
                                return (
                                  (e.t0 = e.sent),
                                  e.abrupt(
                                    'return',
                                    [e.t0]
                                      .map(function (e) {
                                        return [i, e]
                                      })
                                      .map(Te())
                                  )
                                )
                              case 7:
                                return (
                                  (e.next = 9), n.query.xyk.poolAssets.entries()
                                )
                              case 9:
                                if (((e.t1 = e.sent.map(Se).map(Te())), e.t1)) {
                                  e.next = 12
                                  break
                                }
                                e.t1 = []
                              case 12:
                                return e.abrupt('return', e.t1)
                              case 13:
                              case 'end':
                                return e.stop()
                            }
                        }, e)
                      })
                    )
                    return function (n, t) {
                      return e.apply(this, arguments)
                    }
                  })(),
                  [n, t]
                )
              })(),
              r = (function () {
                var e = M(),
                  n = e.apiInstance,
                  t = e.loading
                return Object(c.useCallback)(
                  (function () {
                    var e = Object(f.a)(
                      b.a.mark(function e(i) {
                        return b.a.wrap(function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                if (n && !t && i) {
                                  e.next = 2
                                  break
                                }
                                return e.abrupt('return')
                              case 2:
                                return (
                                  (e.t0 = Te()),
                                  (e.t1 = i),
                                  (e.next = 6),
                                  n.query.xyk.poolAssets(i)
                                )
                              case 6:
                                return (
                                  (e.t2 = e.sent),
                                  (e.t3 = [e.t1, e.t2]),
                                  e.abrupt('return', (0, e.t0)(e.t3))
                                )
                              case 9:
                              case 'end':
                                return e.stop()
                            }
                        }, e)
                      })
                    )
                    return function (n) {
                      return e.apply(this, arguments)
                    }
                  })(),
                  [n, t]
                )
              })(),
              s = (function () {
                var e = M(),
                  n = e.apiInstance,
                  t = e.loading
                return Object(c.useCallback)(
                  (function () {
                    var e = Object(f.a)(
                      b.a.mark(function e(i) {
                        return b.a.wrap(function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                if (n && !t && i) {
                                  e.next = 2
                                  break
                                }
                                return e.abrupt('return')
                              case 2:
                                return (
                                  (e.t0 = Be()),
                                  (e.t1 = i),
                                  (e.next = 6),
                                  n.query.lbp.poolData(i)
                                )
                              case 6:
                                return (
                                  (e.t2 = e.sent),
                                  (e.t3 = [e.t1, e.t2]),
                                  e.abrupt('return', (0, e.t0)(e.t3))
                                )
                              case 9:
                              case 'end':
                                return e.stop()
                            }
                        }, e)
                      })
                    )
                    return function (n) {
                      return e.apply(this, arguments)
                    }
                  })(),
                  [n, t]
                )
              })()
            return B(
              Object(c.useCallback)(
                (function () {
                  var e = Object(f.a)(
                    b.a.mark(function e(c, u) {
                      var o, d, p, v, k, f, y, j, g, N, h, O, x
                      return b.a.wrap(function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              if (n && !t) {
                                e.next = 2
                                break
                              }
                              return e.abrupt('return')
                            case 2:
                              if (
                                ((o =
                                  null === u || void 0 === u
                                    ? void 0
                                    : u.poolId),
                                (d = { lbpPoolId: o, xykPoolId: o }),
                                !(null === u || void 0 === u
                                  ? void 0
                                  : u.assetIds))
                              ) {
                                e.next = 8
                                break
                              }
                              return (e.next = 7), Ie(n, u.assetIds)
                            case 7:
                              d = e.sent
                            case 8:
                              if (!d.xykPoolId && !d.lbpPoolId) {
                                e.next = 21
                                break
                              }
                              return (
                                console.log('fetching pools'),
                                (e.next = 12),
                                s(d.lbpPoolId)
                              )
                            case 12:
                              return (y = e.sent), (e.next = 15), r(d.xykPoolId)
                            case 15:
                              return (
                                (j = e.sent),
                                console.log('pools', y),
                                (null === (p = j) || void 0 === p
                                  ? void 0
                                  : p.assetAId) ===
                                  (null === (v = j) || void 0 === v
                                    ? void 0
                                    : v.assetBId) && (j = void 0),
                                (null === (k = y) || void 0 === k
                                  ? void 0
                                  : k.assetAId) ===
                                  (null === (f = y) || void 0 === f
                                    ? void 0
                                    : f.assetBId) && (y = void 0),
                                (g = j || y),
                                e.abrupt(
                                  'return',
                                  g &&
                                    Object(m.a)(
                                      Object(m.a)({}, g),
                                      {},
                                      {
                                        __typename: j
                                          ? 'XYKPool'
                                          : y
                                          ? 'LBPPool'
                                          : void 0
                                      }
                                    )
                                )
                              )
                            case 21:
                              return (e.next = 23), Promise.all([i(), a()])
                            case 23:
                              return (
                                (N = e.sent),
                                (h = Object(l.a)(N, 2)),
                                (O = h[0]),
                                (x = h[1]),
                                e.abrupt(
                                  'return',
                                  []
                                    .concat(
                                      null === O || void 0 === O
                                        ? void 0
                                        : O.map(function (e) {
                                            return Object(m.a)(
                                              Object(m.a)({}, e),
                                              {},
                                              { __typename: 'LBPPool' }
                                            )
                                          })
                                    )
                                    .concat(
                                      null === x || void 0 === x
                                        ? void 0
                                        : x.map(function (e) {
                                            return Object(m.a)(
                                              Object(m.a)({}, e),
                                              {},
                                              { __typename: 'XYKPool' }
                                            )
                                          })
                                    )
                                )
                              )
                            case 28:
                            case 'end':
                              return e.stop()
                          }
                      }, e)
                    })
                  )
                  return function (n, t) {
                    return e.apply(this, arguments)
                  }
                })(),
                [i]
              ),
              'pools'
            )
          },
          De = function (e) {
            return function (n) {
              var t = Object(l.a)(n, 2),
                i = (t[0], t[1])
              return { id: e.createType('Option<u32>', i).toHuman() }
            }
          },
          Pe = function () {
            var e = M(),
              n = e.apiInstance,
              t = e.loading,
              i = (function () {
                var e = M(),
                  n = e.apiInstance,
                  t = e.loading
                return Object(c.useCallback)(
                  Object(f.a)(
                    b.a.mark(function e() {
                      return b.a.wrap(function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              if (n && !t) {
                                e.next = 2
                                break
                              }
                              return e.abrupt('return')
                            case 2:
                              return (
                                (e.next = 4),
                                null === n || void 0 === n
                                  ? void 0
                                  : n.query.assetRegistry.assetIds.entries()
                              )
                            case 4:
                              if (((e.t0 = e.sent.map(De(n))), e.t0)) {
                                e.next = 7
                                break
                              }
                              e.t0 = []
                            case 7:
                              return e.abrupt('return', e.t0)
                            case 8:
                            case 'end':
                              return e.stop()
                          }
                      }, e)
                    })
                  ),
                  [n, t]
                )
              })()
            return B(
              Object(c.useCallback)(
                Object(f.a)(
                  b.a.mark(function e() {
                    var n
                    return b.a.wrap(function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (e.next = 2), i()
                          case 2:
                            if (
                              ((e.t1 = n = e.sent),
                              (e.t0 = null === e.t1),
                              e.t0)
                            ) {
                              e.next = 6
                              break
                            }
                            e.t0 = void 0 === n
                          case 6:
                            if (!e.t0) {
                              e.next = 10
                              break
                            }
                            ;(e.t2 = void 0), (e.next = 11)
                            break
                          case 10:
                            e.t2 = n.map(function (e) {
                              return Object(m.a)(
                                Object(m.a)({}, e),
                                {},
                                { __typename: 'Asset' }
                              )
                            })
                          case 11:
                            return e.abrupt('return', e.t2)
                          case 12:
                          case 'end':
                            return e.stop()
                        }
                    }, e)
                  })
                ),
                [n, t]
              )
            )
          },
          Fe = t(21),
          Ve = t.n(Fe)
        !(function (e) {
          ;(e.D30 = 'D30'), (e.D7 = 'D7'), (e.H24 = 'H24'), (e.H1 = 'H1')
        })(i || (i = {})),
          (function (e) {
            ;(e.PRICE = 'PRICE'), (e.VOLUME = 'VOLUME'), (e.WEIGHTS = 'WEIGHTS')
          })(a || (a = {})),
          (function (e) {
            ;(e.LBP = 'LBP'), (e.XYK = 'XYK')
          })(r || (r = {})),
          (function (e) {
            ;(e.Buy = 'Buy'), (e.Sell = 'Sell')
          })(s || (s = {}))
        var qe = function (e, n, t) {
            return ve(e, n, t)
          },
          Ce = function (e, n, t) {
            return ve(e, n, t)
          },
          _e = function (e) {
            var n =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : '0.002',
              t = arguments.length > 2 ? arguments[2] : void 0,
              i = new Ve.a(e).multipliedBy(new Ve.a(n)),
              a = new Ve.a(e),
              r = t === s.Buy ? a.plus(i) : a.minus(i)
            return r.toFixed(0)
          },
          Le = function () {
            var e = (function () {
                var e = M(),
                  n = e.apiInstance,
                  t = e.loading
                return Object(c.useCallback)(
                  (function () {
                    var e = Object(f.a)(
                      b.a.mark(function e(i, a, r, s, c) {
                        return b.a.wrap(function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                if (n && !t) {
                                  e.next = 2
                                  break
                                }
                                return e.abrupt('return')
                              case 2:
                                return (
                                  (e.next = 4),
                                  me(
                                    (function () {
                                      var e = Object(f.a)(
                                        b.a.mark(function e(t, u) {
                                          var o, d, l, m, p
                                          return b.a.wrap(function (e) {
                                            for (;;)
                                              switch ((e.prev = e.next)) {
                                                case 0:
                                                  if (
                                                    (l =
                                                      null ===
                                                        (o = i.readQuery({
                                                          query: ue
                                                        })) ||
                                                      void 0 === o ||
                                                      null ===
                                                        (d = o.account) ||
                                                      void 0 === d
                                                        ? void 0
                                                        : d.id)
                                                  ) {
                                                    e.next = 3
                                                    break
                                                  }
                                                  return e.abrupt(
                                                    'return',
                                                    u(
                                                      new Error(
                                                        'No active account found!'
                                                      )
                                                    )
                                                  )
                                                case 3:
                                                  return (
                                                    (e.next = 5), Object(Y.c)(l)
                                                  )
                                                case 5:
                                                  return (
                                                    (m = e.sent),
                                                    (p = m.signer),
                                                    (e.next = 9),
                                                    n.tx.xyk
                                                      .buy(a, r, s, c, !1)
                                                      .signAndSend(
                                                        l,
                                                        { signer: p },
                                                        qe(t, u, n)
                                                      )
                                                  )
                                                case 9:
                                                case 'end':
                                                  return e.stop()
                                              }
                                          }, e)
                                        })
                                      )
                                      return function (n, t) {
                                        return e.apply(this, arguments)
                                      }
                                    })(),
                                    [pe]
                                  )
                                )
                              case 4:
                              case 'end':
                                return e.stop()
                            }
                        }, e)
                      })
                    )
                    return function (n, t, i, a, r) {
                      return e.apply(this, arguments)
                    }
                  })(),
                  [n, t]
                )
              })(),
              n = (function () {
                var e = M(),
                  n = e.apiInstance,
                  t = e.loading
                return Object(c.useCallback)(
                  (function () {
                    var e = Object(f.a)(
                      b.a.mark(function e(i, a, r, s, c) {
                        return b.a.wrap(function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                if (n && !t) {
                                  e.next = 2
                                  break
                                }
                                return e.abrupt('return')
                              case 2:
                                return (
                                  (e.next = 4),
                                  me(
                                    (function () {
                                      var e = Object(f.a)(
                                        b.a.mark(function e(t, u) {
                                          var o, d, l, m, p
                                          return b.a.wrap(function (e) {
                                            for (;;)
                                              switch ((e.prev = e.next)) {
                                                case 0:
                                                  if (
                                                    (l =
                                                      null ===
                                                        (o = i.readQuery({
                                                          query: ue
                                                        })) ||
                                                      void 0 === o ||
                                                      null ===
                                                        (d = o.account) ||
                                                      void 0 === d
                                                        ? void 0
                                                        : d.id)
                                                  ) {
                                                    e.next = 3
                                                    break
                                                  }
                                                  return e.abrupt(
                                                    'return',
                                                    u(
                                                      new Error(
                                                        'No active account found!'
                                                      )
                                                    )
                                                  )
                                                case 3:
                                                  return (
                                                    (e.next = 5), Object(Y.c)(l)
                                                  )
                                                case 5:
                                                  return (
                                                    (m = e.sent),
                                                    (p = m.signer),
                                                    (e.next = 9),
                                                    n.tx.xyk
                                                      .sell(a, r, s, c, !1)
                                                      .signAndSend(
                                                        l,
                                                        { signer: p },
                                                        Ce(t, u, n)
                                                      )
                                                  )
                                                case 9:
                                                case 'end':
                                                  return e.stop()
                                              }
                                          }, e)
                                        })
                                      )
                                      return function (n, t) {
                                        return e.apply(this, arguments)
                                      }
                                    })(),
                                    [pe]
                                  )
                                )
                              case 4:
                              case 'end':
                                return e.stop()
                            }
                        }, e)
                      })
                    )
                    return function (n, t, i, a, r) {
                      return e.apply(this, arguments)
                    }
                  })(),
                  [n, t]
                )
              })()
            return B(
              Object(c.useCallback)(
                (function () {
                  var t = Object(f.a)(
                    b.a.mark(function t(i, a, c) {
                      var u
                      return b.a.wrap(function (t) {
                        for (;;)
                          switch ((t.prev = t.next)) {
                            case 0:
                              if (((u = c.cache), a)) {
                                t.next = 3
                                break
                              }
                              return t.abrupt('return')
                            case 3:
                              if (
                                (null === a || void 0 === a
                                  ? void 0
                                  : a.poolType) !== r.XYK ||
                                (null === a || void 0 === a
                                  ? void 0
                                  : a.tradeType) !== s.Buy
                              ) {
                                t.next = 7
                                break
                              }
                              return (
                                (t.next = 6),
                                e(
                                  u,
                                  a.assetBId,
                                  a.assetAId,
                                  a.assetBAmount,
                                  a.amountWithSlippage
                                )
                              )
                            case 6:
                            case 10:
                              return t.abrupt('return', t.sent)
                            case 7:
                              if (
                                (null === a || void 0 === a
                                  ? void 0
                                  : a.poolType) !== r.XYK ||
                                (null === a || void 0 === a
                                  ? void 0
                                  : a.tradeType) !== s.Sell
                              ) {
                                t.next = 11
                                break
                              }
                              return (
                                (t.next = 10),
                                n(
                                  u,
                                  a.assetAId,
                                  a.assetBId,
                                  a.assetAAmount,
                                  a.amountWithSlippage
                                )
                              )
                            case 11:
                              throw new Error(
                                'We dont support this trade type yet'
                              )
                            case 12:
                            case 'end':
                              return t.stop()
                          }
                      }, t)
                    })
                  )
                  return function (e, n, i) {
                    return t.apply(this, arguments)
                  }
                })(),
                [e]
              )
            )
          },
          Ee = function () {
            var e = {
                Query: { accounts: z() },
                Account: Object(m.a)(Object(m.a)({}, U()), H())
              },
              n = e.Query,
              t = e.Account,
              i = (function () {
                var e = we(),
                  n = Object(m.a)({}, U())
                return { Query: { pools: e }, XYKPool: n, LBPPool: n }
              })(),
              a = i.Query,
              r = i.XYKPool,
              s = i.LBPPool
            return {
              Query: Object(m.a)(
                Object(m.a)(
                  Object(m.a)(
                    Object(m.a)(
                      Object(m.a)(
                        Object(m.a)(Object(m.a)({}, n), {
                          extension: B(
                            Object(c.useCallback)(
                              Object(f.a)(
                                b.a.mark(function e() {
                                  var n
                                  return b.a.wrap(function (e) {
                                    for (;;)
                                      switch ((e.prev = e.next)) {
                                        case 0:
                                          return (
                                            (e.next = 2),
                                            Object(Y.b)('basilisk-ui')
                                          )
                                        case 2:
                                          return (
                                            (n = e.sent),
                                            e.abrupt('return', {
                                              __typename: ge,
                                              id: 'Extension',
                                              isAvailable: !!n.length
                                            })
                                          )
                                        case 4:
                                        case 'end':
                                          return e.stop()
                                      }
                                  }, e)
                                })
                              ),
                              []
                            )
                          )
                        }),
                        he()
                      ),
                      Ae()
                    ),
                    U()
                  ),
                  a
                ),
                { assets: Pe() }
              ),
              Mutation: Object(m.a)(
                Object(m.a)(
                  Object(m.a)(
                    Object(m.a)(
                      Object(m.a)({}, { setActiveAccount: T() }),
                      be()
                    ),
                    je()
                  ),
                  xe()
                ),
                { submitTrade: Le() }
              ),
              Account: t,
              XYKPool: r,
              LBPPool: s
            }
          },
          Qe = {
            kind: 'Document',
            definitions: [
              {
                kind: 'ObjectTypeDefinition',
                name: { kind: 'Name', value: 'Balance' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'assetId' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'balance' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  }
                ]
              },
              {
                kind: 'ObjectTypeDefinition',
                name: { kind: 'Name', value: 'VestingSchedule' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'remainingVestingAmount' },
                    arguments: [],
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'String' }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'start' },
                    arguments: [],
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'String' }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'period' },
                    arguments: [],
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'String' }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'periodCount' },
                    arguments: [],
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'String' }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'perPeriod' },
                    arguments: [],
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'String' }
                    },
                    directives: []
                  }
                ]
              },
              {
                kind: 'ObjectTypeDefinition',
                name: { kind: 'Name', value: 'Account' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'id' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'name' },
                    arguments: [],
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'String' }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'isActive' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'Boolean' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'balances' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'ListType',
                        type: {
                          kind: 'NonNullType',
                          type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'Balance' }
                          }
                        }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'vestingSchedule' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'VestingSchedule' }
                      }
                    },
                    directives: []
                  }
                ]
              },
              {
                kind: 'ObjectTypeExtension',
                name: { kind: 'Name', value: 'Query' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'accounts' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'ListType',
                        type: {
                          kind: 'NonNullType',
                          type: {
                            kind: 'NamedType',
                            name: { kind: 'Name', value: 'Account' }
                          }
                        }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'account' },
                    arguments: [],
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'Account' }
                    },
                    directives: []
                  }
                ]
              },
              {
                kind: 'ObjectTypeExtension',
                name: { kind: 'Name', value: 'Mutation' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'setActiveAccount' },
                    arguments: [],
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'Account' }
                    },
                    directives: []
                  }
                ]
              },
              {
                kind: 'ObjectTypeDefinition',
                name: { kind: 'Name', value: 'LastBlock' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'id' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'parachainBlockNumber' },
                    arguments: [],
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'String' }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'relaychainBlockNumber' },
                    arguments: [],
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'String' }
                    },
                    directives: []
                  }
                ]
              },
              {
                kind: 'ObjectTypeExtension',
                name: { kind: 'Name', value: 'Query' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'lastBlock' },
                    arguments: [],
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'LastBlock' }
                    },
                    directives: []
                  }
                ]
              },
              {
                kind: 'ObjectTypeDefinition',
                name: { kind: 'Name', value: 'Config' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'nodeUrl' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'processorUrl' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'appName' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'feePaymentAsset' },
                    arguments: [],
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'String' }
                    },
                    directives: []
                  }
                ]
              },
              {
                kind: 'ObjectTypeExtension',
                name: { kind: 'Name', value: 'Query' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'config' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'Config' }
                      }
                    },
                    directives: []
                  }
                ]
              },
              {
                kind: 'ObjectTypeDefinition',
                name: { kind: 'Name', value: 'Extension' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'isAvailable' },
                    arguments: [],
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'Boolean' }
                    },
                    directives: []
                  }
                ]
              },
              {
                kind: 'ObjectTypeExtension',
                name: { kind: 'Name', value: 'Query' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'extension' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'Extension' }
                      }
                    },
                    directives: []
                  }
                ]
              },
              {
                kind: 'ObjectTypeDefinition',
                name: { kind: 'Name', value: 'FeePaymentAsset' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'assetId' },
                    arguments: [],
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'String' }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'fallbackPrice' },
                    arguments: [],
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'String' }
                    },
                    directives: []
                  }
                ]
              },
              {
                kind: 'ObjectTypeExtension',
                name: { kind: 'Name', value: 'Query' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'feePaymentAssets' },
                    arguments: [],
                    type: {
                      kind: 'ListType',
                      type: {
                        kind: 'NonNullType',
                        type: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'FeePaymentAsset' }
                        }
                      }
                    },
                    directives: []
                  }
                ]
              },
              {
                kind: 'EnumTypeDefinition',
                name: { kind: 'Name', value: 'PoolType' },
                directives: [],
                values: [
                  {
                    kind: 'EnumValueDefinition',
                    name: { kind: 'Name', value: 'LBP' },
                    directives: []
                  },
                  {
                    kind: 'EnumValueDefinition',
                    name: { kind: 'Name', value: 'XYK' },
                    directives: []
                  }
                ]
              },
              {
                kind: 'EnumTypeDefinition',
                name: { kind: 'Name', value: 'TradeType' },
                directives: [],
                values: [
                  {
                    kind: 'EnumValueDefinition',
                    name: { kind: 'Name', value: 'Buy' },
                    directives: []
                  },
                  {
                    kind: 'EnumValueDefinition',
                    name: { kind: 'Name', value: 'Sell' },
                    directives: []
                  }
                ]
              },
              {
                kind: 'ObjectTypeDefinition',
                name: { kind: 'Name', value: 'LBPPool' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'id' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'assetAId' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'assetBId' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'balances' },
                    arguments: [],
                    type: {
                      kind: 'ListType',
                      type: {
                        kind: 'NonNullType',
                        type: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'Balance' }
                        }
                      }
                    },
                    directives: []
                  }
                ]
              },
              {
                kind: 'ObjectTypeDefinition',
                name: { kind: 'Name', value: 'XYKPool' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'id' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'assetAId' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'assetBId' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'balances' },
                    arguments: [],
                    type: {
                      kind: 'ListType',
                      type: {
                        kind: 'NonNullType',
                        type: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'Balance' }
                        }
                      }
                    },
                    directives: []
                  }
                ]
              },
              {
                kind: 'UnionTypeDefinition',
                name: { kind: 'Name', value: 'Pool' },
                directives: [],
                types: [
                  {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'LBPPool' }
                  },
                  {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'XYKPool' }
                  }
                ]
              },
              {
                kind: 'ObjectTypeExtension',
                name: { kind: 'Name', value: 'Query' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'pools' },
                    arguments: [],
                    type: {
                      kind: 'ListType',
                      type: {
                        kind: 'NonNullType',
                        type: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'Pool' }
                        }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: '_tradeType' },
                    arguments: [],
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'TradeType' }
                    },
                    directives: []
                  }
                ]
              },
              {
                kind: 'ObjectTypeDefinition',
                name: { kind: 'Name', value: 'Asset' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'id' },
                    arguments: [],
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  }
                ]
              },
              {
                kind: 'ObjectTypeExtension',
                name: { kind: 'Name', value: 'Query' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'assets' },
                    arguments: [],
                    type: {
                      kind: 'ListType',
                      type: {
                        kind: 'NonNullType',
                        type: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'Asset' }
                        }
                      }
                    },
                    directives: []
                  }
                ]
              },
              {
                kind: 'ObjectTypeExtension',
                name: { kind: 'Name', value: 'Query' },
                interfaces: [],
                directives: [],
                fields: [
                  {
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: '_empty' },
                    arguments: [],
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'String' }
                    },
                    directives: []
                  }
                ]
              }
            ],
            loc: {
              start: 0,
              end: 2935,
              source: {
                body: "type Balance {\n    assetId: String!,\n    balance: String!\n}# https://github.com/open-web3-stack/open-runtime-module-library/blob/master/vesting/src/lib.rs#L11\ntype VestingSchedule {\n    # total locked amoount left to eventually be claimed\n    remainingVestingAmount: String,\n    # since this block\n    start: String,\n    # every `period` blocks\n    period: String,\n    # for number of periods\n    periodCount: String,\n    # claimable amount per period\n    perPeriod: String\n}#import \"./../../balances/graphql/Balance.graphql\"\n#import './../../vesting/graphql/VestingSchedule.graphql'\n\ntype Account {\n    id: String!,\n    name: String,\n    isActive: Boolean!,\n    balances: [Balance!]!,\n    vestingSchedule: VestingSchedule!\n}\n\nextend type Query {\n    accounts: [Account!]!\n    account: Account\n}\n\nextend type Mutation {\n    setActiveAccount: Account\n}type LastBlock {\n    id: String!\n    # yes, this is correct\n    parachainBlockNumber: String,\n    relaychainBlockNumber: String,\n}\n\nextend type Query {\n    lastBlock: LastBlock\n}type Config {\n    nodeUrl: String!,\n    processorUrl: String!,\n    appName: String!,\n    feePaymentAsset: String\n}\n\nextend type Query {\n    config: Config!\n}type Extension {\n    isAvailable: Boolean\n}\n\nextend type Query {\n    extension: Extension!\n}type FeePaymentAsset {\n    assetId: String,\n    # This price has 18 digit precision, instead of the usual 12\n    fallbackPrice: String\n}\n\n\nextend type Query {\n    feePaymentAssets: [FeePaymentAsset!]\n}#import './../../balances/graphql/Balance.graphql'\n\nenum PoolType {\n    LBP\n    XYK\n}\n\nenum TradeType {\n    Buy,\n    Sell\n}\n\n# figure out how to create a union between two types\n# that extend an interface, apparently this isnt possible as of now\n# \n# interface Pool {\n#     poolType: PoolType!,\n#     assetAId: String!,\n#     assetBId: String!,\n#     assetABalance: String!,\n#     assetBBalance: String!,\n# }\n\ntype LBPPool {\n    id: String!,\n    assetAId: String!,\n    assetBId: String!,\n    balances: [Balance!]\n}\n\ntype XYKPool {\n    id: String!,\n    assetAId: String!,\n    assetBId: String!,\n    balances: [Balance!]\n}\n\nunion Pool = LBPPool | XYKPool\n\nextend type Query {\n    pools: [Pool!]\n    # Just to make sure TradeType makes it through the codegen\n    # otherwise it'd be ignored\n    _tradeType: TradeType\n}type Asset {\n    id: String!\n}\n\nextend type Query {\n    assets: [Asset!]\n}#import './hooks/accounts/graphql/Accounts.graphql'\n#import './hooks/lastBlock/graphql/LastBlock.graphql'\n#import './hooks/config/graphql/Config.graphql'\n#import './hooks/vesting/graphql/VestingSchedule.graphql'\n#import './hooks/polkadotJs/graphql/Extension.graphql'\n#import './hooks/feePaymentAssets/graphql/FeePaymentAssets.graphql'\n#import './hooks/pools/graphql/Pool.graphql'\n#import './hooks/assets/graphql/Asset.graphql'\n\nextend type Query {\n    # just a placeholder to make the codegen not complain about\n    # root query not being defined\n    _empty: String\n}",
                name: 'GraphQL request',
                locationOffset: { line: 1, column: 1 }
              }
            }
          },
          Ge = function () {
            var e = Ee(),
              n = new p.a(),
              t = C(),
              i = Object(l.a)(t, 1)[0].processorUrl,
              a = Object(c.useMemo)(
                function () {
                  return new v.a({
                    uri: i,
                    cache: n,
                    connectToDevTools: !0,
                    queryDeduplication: !0,
                    resolvers: e,
                    typeDefs: Qe
                  })
                },
                [i]
              )
            return (
              (function (e) {
                var n = te()
                Object(c.useEffect)(function () {
                  re(e.cache, Object(m.a)({ __typename: ie, id: ae }, n))
                }, []),
                  Object(c.useEffect)(
                    function () {
                      var t
                      if (n) {
                        var i = e.cache.readQuery({ query: J })
                        ;(
                          null === i ||
                          void 0 === i ||
                          null === (t = i.lastBlock) ||
                          void 0 === t
                            ? void 0
                            : t.parachainBlockNumber
                        )
                          ? e.refetchQueries({
                              updateCache: function (e) {
                                re(
                                  e,
                                  Object(m.a)({ __typename: ie, id: ae }, n)
                                )
                              }
                            })
                          : re(
                              e.cache,
                              Object(m.a)({ __typename: ie, id: ae }, n)
                            )
                      }
                    },
                    [n]
                  )
              })(a),
              a
            )
          },
          We = t(244),
          Me = {
            kind: 'Document',
            definitions: [
              {
                kind: 'OperationDefinition',
                operation: 'query',
                name: { kind: 'Name', value: 'GetExtension' },
                variableDefinitions: [],
                directives: [],
                selectionSet: {
                  kind: 'SelectionSet',
                  selections: [
                    {
                      kind: 'Field',
                      name: { kind: 'Name', value: 'extension' },
                      arguments: [],
                      directives: [
                        {
                          kind: 'Directive',
                          name: { kind: 'Name', value: 'client' },
                          arguments: []
                        }
                      ],
                      selectionSet: {
                        kind: 'SelectionSet',
                        selections: [
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'isAvailable' },
                            arguments: [],
                            directives: []
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ],
            loc: {
              start: 0,
              end: 72,
              source: {
                body: 'query GetExtension {\n    extension @client {\n        isAvailable\n    }\n}',
                name: 'GraphQL request',
                locationOffset: { line: 1, column: 1 }
              }
            }
          },
          Xe = function () {
            return Object(N.a)(Me, { notifyOnNetworkStatusChange: !0 })
          },
          Ue = Object(D.a)(function () {
            return Object(We.a)(Me, { notifyOnNetworkStatusChange: !0 })
          }),
          He = Object(l.a)(Ue, 2),
          Ye = He[0],
          $e =
            (He[1],
            Object(D.a)(function () {
              var e = Object(c.useState)({ instance: void 0, loading: !0 }),
                n = Object(l.a)(e, 2),
                i = n[0],
                a = n[1]
              return (
                Object(c.useEffect)(
                  function () {
                    Object(f.a)(
                      b.a.mark(function e() {
                        return b.a.wrap(function (e) {
                          for (;;)
                            switch ((e.prev = e.next)) {
                              case 0:
                                return (
                                  (e.t0 = a),
                                  (e.next = 3),
                                  t.e(3).then(t.bind(null, 257))
                                )
                              case 3:
                                ;(e.t1 = e.sent),
                                  (e.t2 = { instance: e.t1, loading: !1 }),
                                  (0, e.t0)(e.t2)
                              case 6:
                              case 'end':
                                return e.stop()
                            }
                        }, e)
                      })
                    )()
                  },
                  [a]
                ),
                {
                  math: null === i || void 0 === i ? void 0 : i.instance,
                  loading: null === i || void 0 === i ? void 0 : i.loading
                }
              )
            })),
          Ke = Object(l.a)($e, 2),
          Re = Ke[0],
          ze = Ke[1],
          Je = t(9),
          Ze = function (e) {
            var n = e.children,
              t = Ge()
            return Object(Je.jsx)(d.a, { client: t, children: n })
          },
          en = function (e) {
            var n = e.children
            return Object(Je.jsx)(Ye, { children: n })
          },
          nn = function (e) {
            var n = e.children
            return Object(Je.jsx)(W, {
              children: Object(Je.jsx)(ne, {
                children: Object(Je.jsx)(Ze, {
                  children: Object(Je.jsx)(en, {
                    children: Object(Je.jsx)(Re, { children: n })
                  })
                })
              })
            })
          },
          tn = t(52),
          an = t(18),
          rn = {
            kind: 'Document',
            definitions: [
              {
                kind: 'OperationDefinition',
                operation: 'query',
                name: { kind: 'Name', value: 'GetAssets' },
                variableDefinitions: [],
                directives: [],
                selectionSet: {
                  kind: 'SelectionSet',
                  selections: [
                    {
                      kind: 'Field',
                      name: { kind: 'Name', value: 'assets' },
                      arguments: [],
                      directives: [
                        {
                          kind: 'Directive',
                          name: { kind: 'Name', value: 'client' },
                          arguments: []
                        }
                      ],
                      selectionSet: {
                        kind: 'SelectionSet',
                        selections: [
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'id' },
                            arguments: [],
                            directives: []
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ],
            loc: {
              start: 0,
              end: 57,
              source: {
                body: 'query GetAssets {\n    assets @client {\n        id\n    }\n}',
                name: 'GraphQL request',
                locationOffset: { line: 1, column: 1 }
              }
            }
          },
          sn = {
            kind: 'Document',
            definitions: [
              {
                kind: 'OperationDefinition',
                operation: 'query',
                name: { kind: 'Name', value: 'GetPoolByAssets' },
                variableDefinitions: [
                  {
                    kind: 'VariableDefinition',
                    variable: {
                      kind: 'Variable',
                      name: { kind: 'Name', value: 'assetAId' }
                    },
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'VariableDefinition',
                    variable: {
                      kind: 'Variable',
                      name: { kind: 'Name', value: 'assetBId' }
                    },
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  }
                ],
                directives: [],
                selectionSet: {
                  kind: 'SelectionSet',
                  selections: [
                    {
                      kind: 'Field',
                      name: { kind: 'Name', value: 'lastBlock' },
                      arguments: [],
                      directives: [
                        {
                          kind: 'Directive',
                          name: { kind: 'Name', value: 'client' },
                          arguments: []
                        }
                      ],
                      selectionSet: {
                        kind: 'SelectionSet',
                        selections: [
                          {
                            kind: 'Field',
                            name: {
                              kind: 'Name',
                              value: 'parachainBlockNumber'
                            },
                            arguments: [],
                            directives: []
                          }
                        ]
                      }
                    },
                    {
                      kind: 'Field',
                      alias: { kind: 'Name', value: 'pool' },
                      name: { kind: 'Name', value: 'pools' },
                      arguments: [
                        {
                          kind: 'Argument',
                          name: { kind: 'Name', value: 'assetIds' },
                          value: {
                            kind: 'ListValue',
                            values: [
                              {
                                kind: 'Variable',
                                name: { kind: 'Name', value: 'assetAId' }
                              },
                              {
                                kind: 'Variable',
                                name: { kind: 'Name', value: 'assetBId' }
                              }
                            ]
                          }
                        }
                      ],
                      directives: [
                        {
                          kind: 'Directive',
                          name: { kind: 'Name', value: 'client' },
                          arguments: []
                        }
                      ],
                      selectionSet: {
                        kind: 'SelectionSet',
                        selections: [
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'id' },
                            arguments: [],
                            directives: []
                          },
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'assetAId' },
                            arguments: [],
                            directives: []
                          },
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'assetBId' },
                            arguments: [],
                            directives: []
                          },
                          {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'balances' },
                            arguments: [],
                            directives: [],
                            selectionSet: {
                              kind: 'SelectionSet',
                              selections: [
                                {
                                  kind: 'Field',
                                  name: { kind: 'Name', value: 'assetId' },
                                  arguments: [],
                                  directives: []
                                },
                                {
                                  kind: 'Field',
                                  name: { kind: 'Name', value: 'balance' },
                                  arguments: [],
                                  directives: []
                                }
                              ]
                            }
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ],
            loc: {
              start: 0,
              end: 313,
              source: {
                body: 'query GetPoolByAssets($assetAId: String!, $assetBId: String!) {\n    lastBlock @client {\n        parachainBlockNumber\n    }\n    \n    pool: pools(assetIds: [$assetAId, $assetBId]) @client {\n        id,\n        assetAId,\n        assetBId,\n        balances {\n            assetId,\n            balance\n        }\n    }\n}',
                name: 'GraphQL request',
                locationOffset: { line: 1, column: 1 }
              }
            }
          },
          cn = t(137),
          un = t(251),
          on = {
            kind: 'Document',
            definitions: [
              {
                kind: 'OperationDefinition',
                operation: 'mutation',
                name: { kind: 'Name', value: 'SubmitTrade' },
                variableDefinitions: [
                  {
                    kind: 'VariableDefinition',
                    variable: {
                      kind: 'Variable',
                      name: { kind: 'Name', value: 'assetAId' }
                    },
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'VariableDefinition',
                    variable: {
                      kind: 'Variable',
                      name: { kind: 'Name', value: 'assetBId' }
                    },
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'VariableDefinition',
                    variable: {
                      kind: 'Variable',
                      name: { kind: 'Name', value: 'assetAAmount' }
                    },
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'VariableDefinition',
                    variable: {
                      kind: 'Variable',
                      name: { kind: 'Name', value: 'assetBAmount' }
                    },
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'VariableDefinition',
                    variable: {
                      kind: 'Variable',
                      name: { kind: 'Name', value: 'amountWithSlippage' }
                    },
                    type: {
                      kind: 'NonNullType',
                      type: {
                        kind: 'NamedType',
                        name: { kind: 'Name', value: 'String' }
                      }
                    },
                    directives: []
                  },
                  {
                    kind: 'VariableDefinition',
                    variable: {
                      kind: 'Variable',
                      name: { kind: 'Name', value: 'poolType' }
                    },
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'PoolType' }
                    },
                    directives: []
                  },
                  {
                    kind: 'VariableDefinition',
                    variable: {
                      kind: 'Variable',
                      name: { kind: 'Name', value: 'tradeType' }
                    },
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'TradeType' }
                    },
                    directives: []
                  }
                ],
                directives: [],
                selectionSet: {
                  kind: 'SelectionSet',
                  selections: [
                    {
                      kind: 'Field',
                      name: { kind: 'Name', value: 'submitTrade' },
                      arguments: [
                        {
                          kind: 'Argument',
                          name: { kind: 'Name', value: 'assetAId' },
                          value: {
                            kind: 'Variable',
                            name: { kind: 'Name', value: 'assetAId' }
                          }
                        },
                        {
                          kind: 'Argument',
                          name: { kind: 'Name', value: 'assetBId' },
                          value: {
                            kind: 'Variable',
                            name: { kind: 'Name', value: 'assetBId' }
                          }
                        },
                        {
                          kind: 'Argument',
                          name: { kind: 'Name', value: 'tradeType' },
                          value: {
                            kind: 'Variable',
                            name: { kind: 'Name', value: 'tradeType' }
                          }
                        },
                        {
                          kind: 'Argument',
                          name: { kind: 'Name', value: 'poolType' },
                          value: {
                            kind: 'Variable',
                            name: { kind: 'Name', value: 'poolType' }
                          }
                        },
                        {
                          kind: 'Argument',
                          name: { kind: 'Name', value: 'assetAAmount' },
                          value: {
                            kind: 'Variable',
                            name: { kind: 'Name', value: 'assetAAmount' }
                          }
                        },
                        {
                          kind: 'Argument',
                          name: { kind: 'Name', value: 'assetBAmount' },
                          value: {
                            kind: 'Variable',
                            name: { kind: 'Name', value: 'assetBAmount' }
                          }
                        },
                        {
                          kind: 'Argument',
                          name: { kind: 'Name', value: 'amountWithSlippage' },
                          value: {
                            kind: 'Variable',
                            name: { kind: 'Name', value: 'amountWithSlippage' }
                          }
                        }
                      ],
                      directives: [
                        {
                          kind: 'Directive',
                          name: { kind: 'Name', value: 'client' },
                          arguments: []
                        }
                      ]
                    }
                  ]
                }
              }
            ],
            loc: {
              start: 0,
              end: 487,
              source: {
                body: 'mutation SubmitTrade(\n    $assetAId: String!, \n    $assetBId: String!,\n    $assetAAmount: String!,\n    $assetBAmount: String!,\n    $amountWithSlippage: String!,\n    $poolType: PoolType,\n    $tradeType: TradeType\n) {\n    submitTrade(\n        assetAId: $assetAId\n        assetBId: $assetBId,\n        tradeType: $tradeType,\n        poolType: $poolType,\n        assetAAmount: $assetAAmount,\n        assetBAmount: $assetBAmount,\n        amountWithSlippage: $amountWithSlippage\n    ) @client\n}',
                name: 'GraphQL request',
                locationOffset: { line: 1, column: 1 }
              }
            }
          },
          dn = function (e, n) {
            var t, i
            return null ===
              (t = Object(g.first)(
                null === e ||
                  void 0 === e ||
                  null === (i = e.balances) ||
                  void 0 === i
                  ? void 0
                  : i.filter(function (e) {
                      return e.assetId === n
                    })
              )) || void 0 === t
              ? void 0
              : t.balance
          },
          ln = function (e, n) {
            return Object(c.useMemo)(
              function () {
                return dn(e, n)
              },
              [e, n]
            )
          },
          mn = function (e, n, t) {
            var i = ze().math
            return Object(c.useMemo)(
              function () {
                var a = dn(e, n),
                  r = dn(e, t)
                if (a && r && i) return i.get_spot_price(a, r, '1000000000000')
              },
              [i, e]
            )
          },
          pn = new Ve.a(10).pow(12),
          vn =
            (new Ve.a(10).pow(18),
            function (e) {
              return e && new Ve.a(e).dividedBy(pn).toFixed(12)
            }),
          kn = new Ve.a(10).pow(12),
          bn =
            (new Ve.a(10).pow(18),
            function (e) {
              return e && new Ve.a(e).multipliedBy(kn).toFixed(0)
            }),
          fn = function (e, n) {
            if (e && n) {
              var t = new Ve.a(e)
              return new Ve.a(n).minus(t).dividedBy(t)
            }
          },
          yn = function (e, n, t) {
            var i = new Ve.a(e).multipliedBy(vn(t)).toFixed(0),
              a = fn(i, n)
            if (a && !a.isNaN())
              return (
                Ve.a.config({ ROUNDING_MODE: Ve.a.ROUND_UP }),
                {
                  percentualSlippage: new Ve.a(a)
                    .multipliedBy(100)
                    .abs()
                    .toFixed(10),
                  spotPriceAmount: i
                }
              )
          },
          jn = function (e, n, t, i) {
            if (n.aToB && n.bToA && t && i)
              return yn.apply(
                null,
                e === s.Buy ? [n.aToB, t, i] : [n.bToA, i, t]
              )
          },
          gn = function (e, n) {
            var t = Object(N.a)(rn, { notifyOnNetworkStatusChange: !0 }),
              i = t.data,
              a = t.loading,
              r = n(['assetAId', 'assetAAmount']),
              s = Object(l.a)(r, 1)[0],
              u = n(['assetBId', 'assetBAmount']),
              o = Object(l.a)(u, 1)[0]
            return (
              Object(c.useEffect)(
                function () {
                  e(s, o)
                },
                [s, o]
              ),
              { assets: i, loading: a, assetAId: s, assetBId: o }
            )
          },
          Nn = function (e, n) {
            var t = Object(un.a)(on, { notifyOnNetworkStatusChange: !0 }),
              i = Object(l.a)(t, 1)[0]
            return {
              form: Object(cn.a)({
                defaultValues: {
                  assetAAmount: '0',
                  assetBAmount: '0',
                  allowedSlippage: '5',
                  amountWithSlippage: void 0
                }
              }),
              handleSubmit: function (t) {
                e &&
                  n &&
                  i({
                    variables: {
                      assetAId: t.assetAId,
                      assetBId: t.assetBId,
                      assetAAmount: bn(t.assetAAmount),
                      assetBAmount: bn(t.assetBAmount),
                      amountWithSlippage: t.amountWithSlippage,
                      tradeType: n,
                      poolType:
                        'XYKPool' ===
                        (null === e || void 0 === e ? void 0 : e.__typename)
                          ? r.XYK
                          : r.LBP
                    }
                  })
              }
            }
          },
          hn = function (e, n, t) {
            var i =
                (function (e, n, t, i, a) {
                  var r = ze().math,
                    s = dn(e, n),
                    c = dn(e, t)
                  if (s && c && r && i && a) {
                    var u =
                      null === r || void 0 === r
                        ? void 0
                        : r.calculate_in_given_out(s, c, i)
                    if (u)
                      return {
                        inGivenOut: u,
                        inGivenOutWithFee: _e(u, '0.002', a)
                      }
                  }
                })(
                  n,
                  e.getValues('assetAId'),
                  e.getValues('assetBId'),
                  bn(e.getValues('assetBAmount')),
                  t
                ) || {},
              a = i.inGivenOutWithFee,
              r = i.inGivenOut,
              u =
                (function (e, n, t, i, a) {
                  var r = ze().math,
                    s = dn(e, n),
                    c = dn(e, t)
                  if (s && c && r && i && a) {
                    var u =
                      null === r || void 0 === r
                        ? void 0
                        : r.calculate_out_given_in(s, c, i)
                    if (u)
                      return {
                        outGivenIn: u,
                        outGivenInWithFee: _e(u, '0.002', a)
                      }
                  }
                })(
                  n,
                  e.getValues('assetAId'),
                  e.getValues('assetBId'),
                  bn(e.getValues('assetAAmount')),
                  t
                ) || {},
              o = u.outGivenInWithFee,
              d = u.outGivenIn
            return (
              Object(c.useEffect)(
                function () {
                  t === s.Buy && e.setValue('assetAAmount', vn(a)),
                    t === s.Sell && e.setValue('assetBAmount', vn(o))
                },
                [a, o]
              ),
              {
                calculatedAssetAAmount: a,
                calculatedAssetAAmountWithoutFee: r,
                calculatedAssetBAmount: o,
                calculatedAssetBAmountWithoutFee: d
              }
            )
          },
          On = function (e, n, t) {
            Object(c.useEffect)(
              function () {
                ;(null === n || void 0 === n ? void 0 : n.spotPriceAmount) &&
                  e.setValue(
                    'amountWithSlippage',
                    (function (e, n, t) {
                      var i = new Ve.a(e).multipliedBy(
                          new Ve.a(n).dividedBy(100)
                        ),
                        a = new Ve.a(e)
                      return (t === s.Buy ? a.plus(i) : a.minus(i)).toFixed(0)
                    })(
                      null === n || void 0 === n ? void 0 : n.spotPriceAmount,
                      e.getValues('allowedSlippage'),
                      t
                    )
                  )
              },
              [
                e.watch(['allowedSlippage']),
                null === n || void 0 === n ? void 0 : n.spotPriceAmount
              ]
            )
          },
          xn = function (e) {
            var n = e.onAssetIdsChange,
              t = e.pool,
              i = (function () {
                var e = Object(c.useState)(s.Sell),
                  n = Object(l.a)(e, 2),
                  t = n[0],
                  i = n[1]
                return {
                  tradeType: t,
                  onAssetAAmountInput: function () {
                    return i(s.Sell)
                  },
                  onAssetBAmountInput: function () {
                    return i(s.Buy)
                  }
                }
              })(),
              a = i.tradeType,
              r = i.onAssetAAmountInput,
              u = i.onAssetBAmountInput,
              o = Nn(t, a),
              d = o.form,
              p = o.handleSubmit,
              v = d.register,
              k = d.watch,
              b = d.getValues,
              f = d.setValue,
              y = gn(n, k),
              j = y.assets,
              g = y.loading,
              N = y.assetAId,
              h = y.assetBId
            !(function (e, n) {
              Object(c.useEffect)(
                function () {
                  e || (n('assetAId', '0'), n('assetBId', '1'))
                },
                [e]
              )
            })(g, f)
            var O = (function (e, n, t) {
                return {
                  liquidity: {
                    assetA: { balance: ln(e, n) },
                    assetB: { balance: ln(e, t) }
                  },
                  spotPrice: { aToB: mn(e, t, n), bToA: mn(e, n, t) }
                }
              })(t, N, h),
              x = O.liquidity,
              A = O.spotPrice,
              S = hn(d, t, a),
              T = S.calculatedAssetAAmount,
              B = S.calculatedAssetAAmountWithoutFee,
              I = S.calculatedAssetBAmount,
              w = S.calculatedAssetBAmountWithoutFee,
              D = jn(a, A, T, I)
            On(d, D, a)
            var P = Object(c.useCallback)(
              function (e) {
                return Object(Je.jsx)(Je.Fragment, {
                  children:
                    null === j || void 0 === j
                      ? void 0
                      : j.assets
                          .filter(function (n) {
                            return n.id !== e
                          })
                          .map(function (e) {
                            return Object(Je.jsx)(
                              'option',
                              { value: ''.concat(e.id), children: e.id },
                              e.id
                            )
                          })
                })
              },
              [j]
            )
            return Object(Je.jsxs)('div', {
              children: [
                g
                  ? Object(Je.jsx)('i', {
                      children: '[TradeForm] Loading assets...'
                    })
                  : Object(Je.jsx)('i', {
                      children: '[TradeForm] Everything is up to date'
                    }),
                Object(Je.jsx)('br', {}),
                Object(Je.jsx)('br', {}),
                Object(Je.jsxs)('form', {
                  onSubmit: d.handleSubmit(p),
                  children: [
                    Object(Je.jsxs)('div', {
                      children: [
                        Object(Je.jsxs)('div', {
                          children: [
                            Object(Je.jsx)('label', {
                              children: Object(Je.jsx)('b', {
                                children: '(Pay with) Asset A: '
                              })
                            }),
                            Object(Je.jsx)(
                              'select',
                              Object(m.a)(
                                Object(m.a)(
                                  {},
                                  v('assetAId', { required: !0 })
                                ),
                                {},
                                { children: P(b('assetBId')) }
                              )
                            )
                          ]
                        }),
                        Object(Je.jsx)('div', {
                          children: Object(Je.jsx)('div', {
                            children: Object(Je.jsx)(
                              'input',
                              Object(m.a)(
                                Object(m.a)(
                                  {
                                    type: 'text',
                                    width: 100,
                                    style: {
                                      width: '100%',
                                      marginTop: '12px',
                                      marginBottom: '24px'
                                    }
                                  },
                                  v('assetAAmount', { required: !0 })
                                ),
                                {},
                                { onInput: r }
                              )
                            )
                          })
                        })
                      ]
                    }),
                    Object(Je.jsxs)('div', {
                      children: [
                        Object(Je.jsx)('label', {
                          children: Object(Je.jsx)('b', {
                            children: '(You get) Asset B: '
                          })
                        }),
                        Object(Je.jsx)(
                          'select',
                          Object(m.a)(
                            Object(m.a)({}, v('assetBId', { required: !0 })),
                            {},
                            { children: P(b('assetAId')) }
                          )
                        )
                      ]
                    }),
                    Object(Je.jsx)('div', {
                      children: Object(Je.jsx)(
                        'input',
                        Object(m.a)(
                          Object(m.a)(
                            {
                              type: 'text',
                              width: 100,
                              style: {
                                width: '100%',
                                marginTop: '12px',
                                marginBottom: '24px'
                              }
                            },
                            v('assetBAmount', { required: !0 })
                          ),
                          {},
                          { onInput: u }
                        )
                      )
                    }),
                    Object(Je.jsx)('div', {
                      children: Object(Je.jsx)('label', {
                        children: Object(Je.jsx)('b', {
                          children: '(%) Slippage: '
                        })
                      })
                    }),
                    Object(Je.jsx)('div', {
                      children: Object(Je.jsx)(
                        'input',
                        Object(m.a)(
                          {
                            type: 'text',
                            width: 100,
                            style: {
                              width: '100%',
                              marginTop: '12px',
                              marginBottom: '24px'
                            }
                          },
                          v('allowedSlippage', { required: !0 })
                        )
                      )
                    }),
                    Object(Je.jsx)('button', {
                      type: 'submit',
                      style: { width: '100%' },
                      children: 'Trade'
                    }),
                    Object(Je.jsx)('br', {}),
                    Object(Je.jsx)('br', {}),
                    Object(Je.jsxs)('div', {
                      children: [
                        Object(Je.jsxs)('p', {
                          children: [
                            Object(Je.jsx)('b', { children: 'Trade type:' }),
                            ' ',
                            a
                          ]
                        }),
                        Object(Je.jsx)('div', {
                          children: t
                            ? Object(Je.jsxs)('div', {
                                children: [
                                  Object(Je.jsxs)('p', {
                                    children: [
                                      Object(Je.jsx)('b', {
                                        children: 'Pool Id:'
                                      }),
                                      ' ',
                                      null === t || void 0 === t ? void 0 : t.id
                                    ]
                                  }),
                                  Object(Je.jsxs)('p', {
                                    children: [
                                      Object(Je.jsx)('b', {
                                        children: 'Pool type:'
                                      }),
                                      ' ',
                                      null === t || void 0 === t
                                        ? void 0
                                        : t.__typename
                                    ]
                                  }),
                                  Object(Je.jsxs)('p', {
                                    children: [
                                      Object(Je.jsx)('b', {
                                        children: 'Liquidity Asset A:'
                                      }),
                                      ' ',
                                      vn(x.assetA.balance)
                                    ]
                                  }),
                                  Object(Je.jsxs)('p', {
                                    children: [
                                      Object(Je.jsx)('b', {
                                        children: 'Liquidity Asset B:'
                                      }),
                                      ' ',
                                      vn(x.assetB.balance)
                                    ]
                                  }),
                                  Object(Je.jsxs)('p', {
                                    children: [
                                      Object(Je.jsx)('b', {
                                        children: 'Spot prices:'
                                      }),
                                      Object(Je.jsx)('br', {}),
                                      Object(Je.jsxs)('span', {
                                        children: ['1 B = ', vn(A.aToB), ' A']
                                      }),
                                      Object(Je.jsx)('br', {}),
                                      Object(Je.jsxs)('span', {
                                        children: ['1 A = ', vn(A.bToA), ' B']
                                      })
                                    ]
                                  }),
                                  Object(Je.jsxs)('p', {
                                    children: [
                                      Object(Je.jsxs)('b', {
                                        children: ['Slippage (', a, '): ']
                                      }),
                                      D
                                        ? ''
                                            .concat(
                                              D.percentualSlippage,
                                              '% / '
                                            )
                                            .concat(vn(D.spotPriceAmount))
                                        : '-'
                                    ]
                                  }),
                                  Object(Je.jsxs)('p', {
                                    children: [
                                      Object(Je.jsx)('b', {
                                        children:
                                          'Calculated amount with slippage: '
                                      }),
                                      vn(d.getValues('amountWithSlippage'))
                                    ]
                                  }),
                                  Object(Je.jsxs)('p', {
                                    children: [
                                      Object(Je.jsx)('b', {
                                        children:
                                          'Calculated amount without fee (A/B): '
                                      }),
                                      ''.concat(vn(B), ' / ').concat(vn(w))
                                    ]
                                  })
                                ]
                              })
                            : Object(Je.jsx)('b', {
                                children: 'Pool does not exist'
                              })
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          },
          An = function () {
            var e,
              n = Object(c.useState)({ assetAId: void 0, assetBId: void 0 }),
              t = Object(l.a)(n, 2),
              i = t[0],
              a = t[1],
              r =
                ((e = i),
                Object(N.a)(sn, {
                  variables: e,
                  notifyOnNetworkStatusChange: !0
                })),
              s = r.data,
              u = r.loading,
              o = r.error
            o && console.error(o)
            return Object(Je.jsxs)('div', {
              children: [
                Object(Je.jsx)('h1', { children: 'Trade' }),
                u
                  ? Object(Je.jsx)('i', {
                      children: '[TradePage] Loading pools...'
                    })
                  : Object(Je.jsx)('i', {
                      children: '[TradePage] Pools are up to date'
                    }),
                Object(Je.jsx)('br', {}),
                Object(Je.jsx)('br', {}),
                Object(Je.jsx)(xn, {
                  onAssetIdsChange: function (e, n) {
                    var t = { assetAId: e, assetBId: n }
                    Object(g.isEqual)(i, t) || a(t)
                  },
                  pool: null === s || void 0 === s ? void 0 : s.pool
                })
              ]
            })
          },
          Sn = {
            kind: 'Document',
            definitions: [
              {
                kind: 'OperationDefinition',
                operation: 'mutation',
                name: { kind: 'Name', value: 'SetActiveAccount' },
                variableDefinitions: [
                  {
                    kind: 'VariableDefinition',
                    variable: {
                      kind: 'Variable',
                      name: { kind: 'Name', value: 'id' }
                    },
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'String' }
                    },
                    directives: []
                  }
                ],
                directives: [],
                selectionSet: {
                  kind: 'SelectionSet',
                  selections: [
                    {
                      kind: 'Field',
                      name: { kind: 'Name', value: 'setActiveAccount' },
                      arguments: [
                        {
                          kind: 'Argument',
                          name: { kind: 'Name', value: 'id' },
                          value: {
                            kind: 'Variable',
                            name: { kind: 'Name', value: 'id' }
                          }
                        }
                      ],
                      directives: [
                        {
                          kind: 'Directive',
                          name: { kind: 'Name', value: 'client' },
                          arguments: []
                        }
                      ]
                    }
                  ]
                }
              }
            ],
            loc: {
              start: 0,
              end: 80,
              source: {
                body: 'mutation SetActiveAccount($id: String) {\n    setActiveAccount(id: $id) @client\n}',
                name: 'GraphQL request',
                locationOffset: { line: 1, column: 1 }
              }
            }
          },
          Tn = function (e) {
            return Object(un.a)(Sn, { variables: e, refetchQueries: [ue] })
          },
          Bn = function (e) {
            var n = e.account,
              t = Tn({ id: null === n || void 0 === n ? void 0 : n.id }),
              i = Object(l.a)(t, 1)[0],
              a = Tn({ id: void 0 }),
              r = Object(l.a)(a, 1)[0]
            return Object(Je.jsxs)('div', {
              style: { marginBottom: '24px', padding: '12px', paddingLeft: 0 },
              children: [
                Object(Je.jsxs)('h3', {
                  children: [
                    null === n || void 0 === n ? void 0 : n.name,
                    (null === n || void 0 === n ? void 0 : n.isActive)
                      ? ' [active]'
                      : Object(Je.jsx)(Je.Fragment, {})
                  ]
                }),
                Object(Je.jsxs)('p', {
                  children: [
                    Object(Je.jsx)('b', { children: 'Address:' }),
                    null === n || void 0 === n ? void 0 : n.id
                  ]
                }),
                Object(Je.jsxs)('div', {
                  children: [
                    Object(Je.jsx)('b', { children: 'Balances:' }),
                    null === n || void 0 === n
                      ? void 0
                      : n.balances.map(function (e, n) {
                          return Object(Je.jsxs)(
                            'p',
                            {
                              children: [
                                e.assetId,
                                ':',
                                Object(Je.jsxs)('i', {
                                  children: [' ', e.balance]
                                })
                              ]
                            },
                            n
                          )
                        })
                  ]
                }),
                Object(Je.jsx)('button', {
                  onClick: function (e) {
                    return (null === n || void 0 === n ? void 0 : n.isActive)
                      ? r()
                      : i()
                  },
                  children: (null === n || void 0 === n ? void 0 : n.isActive)
                    ? 'Unset active'
                    : 'Set active'
                })
              ]
            })
          },
          In = function () {
            var e,
              n = Object(N.a)(h, { notifyOnNetworkStatusChange: !0 }),
              t = n.data,
              i = n.loading,
              a = Xe(),
              r = a.data,
              s = a.loading,
              u = Object(c.useMemo)(
                function () {
                  return i || s
                },
                [i, s]
              )
            return Object(Je.jsxs)('div', {
              style: { textAlign: 'left' },
              children: [
                Object(Je.jsx)('h1', { children: 'Accounts' }),
                u
                  ? Object(Je.jsx)('i', {
                      children: '[WalletPage] Loading accounts...'
                    })
                  : Object(Je.jsx)('i', {
                      children: '[WalletPage] Everything is up to date'
                    }),
                Object(Je.jsx)('br', {}),
                Object(Je.jsx)('br', {}),
                (null === r || void 0 === r ? void 0 : r.extension.isAvailable)
                  ? Object(Je.jsx)('div', {
                      children:
                        null === t ||
                        void 0 === t ||
                        null === (e = t.accounts) ||
                        void 0 === e
                          ? void 0
                          : e.map(function (e, n) {
                              return Object(Je.jsx)(Bn, { account: e }, n)
                            })
                    })
                  : Object(Je.jsx)('p', { children: 'Extension unavailable' })
              ]
            })
          },
          wn = function () {
            return Object(Je.jsxs)(an.d, {
              children: [
                Object(Je.jsx)(an.b, {
                  path: '/',
                  element: Object(Je.jsx)(An, {})
                }),
                Object(Je.jsx)(an.b, {
                  path: 'wallet',
                  element: Object(Je.jsx)(In, {})
                }),
                Object(Je.jsx)(an.b, {
                  path: '*',
                  element: Object(Je.jsx)(an.a, { to: '/' })
                })
              ]
            })
          },
          Dn = function () {
            var e,
              n,
              t,
              i,
              a,
              r = Object(N.a)(J).data,
              s = oe(),
              u = s.data,
              o = s.loading,
              d = Xe(),
              l = d.data,
              m = d.loading,
              p = Object(c.useMemo)(
                function () {
                  var e, n, t
                  return null ===
                    (e = Object(g.first)(
                      null === u ||
                        void 0 === u ||
                        null === (n = u.account) ||
                        void 0 === n ||
                        null === (t = n.balances) ||
                        void 0 === t
                        ? void 0
                        : t.filter(function (e) {
                            return e.assetId === X
                          })
                    )) || void 0 === e
                    ? void 0
                    : e.balance
                },
                [u]
              )
            return Object(Je.jsx)('div', {
              style: { textAlign: 'center', marginBottom: '24px' },
              children: Object(Je.jsxs)('div', {
                children: [
                  Object(Je.jsx)(tn.b, { to: '/', children: 'Trade' }),
                  ' | ',
                  Object(Je.jsx)(tn.b, { to: '/wallet', children: 'Wallet' }),
                  ' | ',
                  Object(Je.jsx)(tn.b, { to: '/config', children: 'Config' }),
                  Object(Je.jsxs)('div', {
                    children: [
                      Object(Je.jsxs)('span', {
                        children: [
                          Object(Je.jsx)('b', { children: 'Last block: ' }),
                          (
                            null === r ||
                            void 0 === r ||
                            null === (e = r.lastBlock) ||
                            void 0 === e
                              ? void 0
                              : e.parachainBlockNumber
                          )
                            ? '#'
                                .concat(
                                  null === r ||
                                    void 0 === r ||
                                    null === (n = r.lastBlock) ||
                                    void 0 === n
                                    ? void 0
                                    : n.parachainBlockNumber,
                                  ' / #'
                                )
                                .concat(
                                  null === r ||
                                    void 0 === r ||
                                    null === (t = r.lastBlock) ||
                                    void 0 === t
                                    ? void 0
                                    : t.relaychainBlockNumber
                                )
                            : 'loading...'
                        ]
                      }),
                      ' | ',
                      Object(Je.jsxs)('span', {
                        children: [
                          Object(Je.jsx)('b', { children: 'Active account: ' }),
                          m
                            ? 'loading...'
                            : (
                                null === l || void 0 === l
                                  ? void 0
                                  : l.extension.isAvailable
                              )
                            ? Object(Je.jsx)(Je.Fragment, {
                                children: o
                                  ? 'loading...'
                                  : (
                                      null === u ||
                                      void 0 === u ||
                                      null === (i = u.account) ||
                                      void 0 === i
                                        ? void 0
                                        : i.name
                                    )
                                  ? Object(Je.jsx)(Je.Fragment, {
                                      children: Object(Je.jsxs)('span', {
                                        children: [
                                          null === u ||
                                          void 0 === u ||
                                          null === (a = u.account) ||
                                          void 0 === a
                                            ? void 0
                                            : a.name,
                                          ' | ',
                                          p,
                                          ' BSX'
                                        ]
                                      })
                                    })
                                  : Object(Je.jsx)(tn.b, {
                                      to: '/wallet',
                                      children: 'select an account'
                                    })
                              })
                            : Object(Je.jsx)('span', {
                                children: 'Extension unavailable'
                              })
                        ]
                      })
                    ]
                  })
                ]
              })
            })
          },
          Pn = function (e) {
            var n = e.children,
              t = (function () {
                var e = M(),
                  n = e.apiInstance,
                  t = e.loading
                return !n || t
              })()
            return Object(Je.jsxs)('div', {
              style: { padding: '24px', width: '650px', margin: '0 auto' },
              children: [
                Object(Je.jsx)(Dn, {}),
                t
                  ? Object(Je.jsx)('div', {
                      style: { width: '100%', textAlign: 'center' },
                      children: Object(Je.jsx)('i', {
                        children: 'Connecting to the node...'
                      })
                    })
                  : n
              ]
            })
          }
        j.a.setLevel('info')
        var Fn = 'develop',
          Vn = Fn.length ? 'basilisk-ui/'.concat(Fn, '/app') : void 0,
          qn = function () {
            return Object(Je.jsx)(nn, {
              children: Object(Je.jsx)(tn.a, {
                basename: Vn,
                children: Object(Je.jsx)(Pn, {
                  children: Object(Je.jsx)(wn, {})
                })
              })
            })
          },
          Cn = function (e) {
            e &&
              e instanceof Function &&
              t
                .e(4)
                .then(t.bind(null, 258))
                .then(function (n) {
                  var t = n.getCLS,
                    i = n.getFID,
                    a = n.getFCP,
                    r = n.getLCP,
                    s = n.getTTFB
                  t(e), i(e), a(e), r(e), s(e)
                })
          }
        t(216)
        o.a.render(Object(Je.jsx)(qn, {}), document.getElementById('root')),
          Cn()
      }
    },
    [[217, 1, 2]]
  ]
)
//# sourceMappingURL=main.bd7fe8d2.chunk.js.map
