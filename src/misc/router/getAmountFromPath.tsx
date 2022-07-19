import { XykPool } from '../../generated/graphql';
import { HydraDxMath } from '../../hooks/math/useMath';
import { calculateInGivenOutFromPool } from '../../hooks/pools/xyk/calculateInGivenOut';
import { calculateOutGivenInFromPool } from '../../hooks/pools/xyk/calculateOutGivenIn';
import { throwForInvalidPath } from './buildPath';
import { Path, Swap, SwapTypes } from './types';

/**
 * This function calculates the amount for each swap in a path.
 * 
 * For SwapType Sell: The first item of amounts array is the user
 * provided amount and subsequent amounts are computed values.
 * For SwapType Buy: The last item of amounts array is the user 
 * provided amount and all previous amounts are computed values.
 * 
 * Note: path contains all swap info and pool balances
 * 
 * @param path computed by the router
 * @param swapType sell or buy
 * @param amount amountIn for sell & amountOut for buy
 * @param math HydraDX wasm library for XYK math
 * @returns an array of all amounts
 */
export function getAmounts(
  path: Path,
  swapType: SwapTypes,
  amount: string,
  math: HydraDxMath
): string[] {
  throwForInvalidPath(path);

  const swaps = path.swaps;
  // TODO: remove this workaround
  const pools = path.pools as XykPool[];
  const amounts = [amount];

  if (swapType === SwapTypes.SwapExactIn) {
    // TODO: refactor old-fashioned for loop
    for (let i = 0; i < swaps.length; i++) {
      amounts.push(
        getOutputAmountSwap(
          swaps[i],
          pools[i],
          swapType,
          amounts[amounts.length - 1], // take latest output amount as input
          math
        )
      );
    }
  } else if (swapType === SwapTypes.SwapExactOut) {
    const n = swaps.length;
    // TODO: refactor old-fashioned for loop
    for (let i = 0; i < swaps.length; i++) {
      amounts.unshift(
        getOutputAmountSwap(
          swaps[n - 1 - i],
          pools[n - 1 - i],
          swapType,
          amounts[0],
          math
        )
      );
    }
  }
  return amounts;
}

/**
 * Computes for swap either the input or output amount
 * based on the swapType.
 */
export function getOutputAmountSwap(
  swap: Swap,
  pool: XykPool,
  swapType: SwapTypes,
  amount: string,
  math: HydraDxMath
): string {
  // TODO: check if necessary to check if amount > limitAmount
  if (swapType === SwapTypes.SwapExactIn) {
    const amountIn = amount;
    const amountOut = calculateOutGivenInFromPool(
      math,
      pool,
      swap.assetIn.id,
      swap.assetOut.id,
      amountIn
    );
    return amountOut ? amountOut : '0';
  } else if (swapType === SwapTypes.SwapExactOut) {
    const amountOut = amount;
    const amountIn = calculateInGivenOutFromPool(
      math,
      pool,
      swap.assetIn.id,
      swap.assetOut.id,
      amountOut
    );
    return amountIn ? amountIn : '0';
  } else throw Error('Unsupported swap');
}
