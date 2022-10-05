import { Asset, Pool } from '../../generated/graphql'
import { Path } from './types'
import { includes } from 'lodash'
import { buildPath } from './buildPath'

export const computeAllPaths = (
  tokenIn: Asset,
  tokenOut: Asset,
  pools: Pool[],
  maxHops: number
): Path[] => {
  const poolUsedInPath = Array<boolean>(pools.length).fill(false)
  const routes: Path[] = []

  const computeRoutes = (
    tokenIn: Asset,
    tokenOut: Asset,
    currentRoute: Pool[],
    poolsUsed: boolean[],
    _previousTokenOut?: Asset
  ) => {
    if (currentRoute.length > maxHops) {
      return
    }

    if (
      currentRoute.length > 0 &&
      includes(currentRoute[currentRoute.length - 1], tokenOut.id)
    ) {
      const path = buildPath(tokenIn, tokenOut, [...currentRoute])

      // TODO: undefined handling for path
      routes.push(path!)
      return
    }

    for (let i = 0; i < pools.length; i++) {
      if (poolsUsed[i]) {
        continue
      }

      const currentPool = pools[i]
      const previousTokenOut = _previousTokenOut ? _previousTokenOut : tokenIn

      if (!includes(currentPool, previousTokenOut.id)) {
        continue
      }

      const currentTokenOut =
        currentPool.assetInId === previousTokenOut.id
          ? currentPool.assetOutId
          : currentPool.assetInId

      currentRoute.push(currentPool)

      poolsUsed[i] = true
      computeRoutes(tokenIn, tokenOut, currentRoute, poolsUsed, {
        id: currentTokenOut
      })
      poolsUsed[i] = false
      currentRoute.pop()
    }
  }

  computeRoutes(tokenIn, tokenOut, [], poolUsedInPath)
  return routes
}
