import BigNumber from 'bignumber.js';
import { XykPool } from '../../generated/graphql';
import {
  precision12,
} from '../../hooks/math/useFromPrecision';
import { HydraDxMath } from '../../hooks/math/useMath';
import { calculateSpotPriceFromPool } from '../../hooks/pools/xyk/calculateSpotPrice';
import { throwForInvalidPath } from './buildPath';
import { Path, Swap } from './types';

/**
 * This function returns the spot price from the first asset (assetIn)
 * to the final asset (assetOut) of the path.
 * 
 * @param path computed by router
 * @param math HydraDX wasm library for xyk math
 * @returns spot price between assetIn and assetOut of path
 */
export function getSpotPriceFromPath(path: Path, math: HydraDxMath): string {
  throwForInvalidPath(path);

  const spotPrices = getSpotPrices(path, math);

  // multiply each spot price along the path to receive a single value
  const spotPrice = spotPrices.reduce(
    (a, b) => a.multipliedBy(b).dividedBy(precision12),
    new BigNumber(1)
  );

  return spotPrice
    .multipliedBy(precision12)
    .toString();
}

/**
 * This function calculates for each swap in path the spot price.
 * 
 * @param path computed by router
 * @param math HydraDX wasm library for xyk math
 * @returns an array of spot prices for each swap
 */
function getSpotPrices(path: Path, math: HydraDxMath): string[] {
  const swaps = path.swaps;
  const pools = path.pools as XykPool[];
  const spotPrices: string[] = [];

  swaps.forEach((swap, index) => {
    spotPrices.push(getSpotPriceFromSwap(swap, pools[index], math));
  });

  return spotPrices;
}

/**
 * Computes for swap the spot price.
 */
function getSpotPriceFromSwap(
  swap: Swap,
  pool: XykPool,
  math: HydraDxMath
): string {
  const spotPrice = calculateSpotPriceFromPool(
    math,
    pool,
    swap.assetIn.id,
    swap.assetOut.id
  );
  return spotPrice ? spotPrice : '0';
}
