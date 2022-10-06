import { getAmounts } from './getAmountFromPath'
import { SwapTypes } from './types'
import xyk from 'hydra-dx-wasm/build/xyk/nodejs'
import { HydraDxMath, HydraDxMathLbp } from '../../hooks/math/useMath'
import testData from './getAmountFromPath.json'

describe('getAmountFromPath', () => {
  let math: HydraDxMath

  beforeAll(async () => {
    math = { xyk, lbp: undefined as unknown as HydraDxMathLbp }
  })

  it.each(testData.sell)(
    `can compute amountOut for SELL with $path.swaps.length swaps in the path`,
    ({ path, amounts }) => {
      // first item in amounts is amountIn for SELL
      const amountIn = amounts[0]
      // remaining items in amounts are amountsOut
      const expectedAmountsOut = amounts

      const computedAmounts = getAmounts(
        path,
        SwapTypes.SwapExactIn,
        amountIn,
        math
      )
      const computedAmountsOut = computedAmounts

      expect(computedAmountsOut).toEqual(expectedAmountsOut)
    }
  )

  it.each(testData.buy)(
    `can compute amountOut for BUY with $path.swaps.length swaps in the path`,
    ({ path, amounts }) => {
      // last item in amounts is amountOut
      const amountsOut = amounts[amounts.length - 1]

      const computedAmounts = getAmounts(
        path,
        SwapTypes.SwapExactOut,
        amountsOut,
        math
      )

      expect(computedAmounts).toEqual(amounts)
    }
  )

  it('throws for invalid path', () => {
    expect(() =>
      getAmounts(
        testData.brokenPath.path,
        SwapTypes.SwapExactIn,
        testData.brokenPath.amounts[0],
        math
      )
    ).toThrow('Path is invalid. Not equal amount of Swaps and Pools')
  })
})
