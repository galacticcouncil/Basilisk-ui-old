import { Asset, Pool } from '../../generated/graphql';
import { Path, Swap } from './types';

/**
 * The number of pools needs to be less than tokens by 1.
 * pools has n items
 * tokens has n+1 items
 */
const createPath = (tokens: Asset[], pools: Pool[]): Path => {
  const swaps: Swap[] = [];
  let id = '';

  pools.forEach((pool, index) => {
    const tokenIn = tokens[index];
    const tokenOut = tokens[index + 1];

    const swap: Swap = {
      id: pool.id,
      assetIn: tokenIn,
      assetOut: tokenOut,
    };
    swaps.push(swap);
    // TODO: construct ID by appending poolPairId
    id = id + pool.id;
  });

  return {
    id, // a string of all pools concatenated
    swaps, // all necessary swaps
    pools, // returns pool base as well
  } as Path;
};

/**
 * swap[0].assetIn = tokenIn
 * swap[0].assetOut = swap[1].assetIn
 * swap[1].assetOut = swap[2].assetIn
 * ...
 * swap[n].assetOut = tokenIn
 */
export const orderSwapsInPath = (
  tokenIn: Asset,
  tokenOut: Asset,
  path: Path
): Path => {
  let previousSwap: Swap;

  path.swaps.forEach((swap, index) => {
    // for first swap we check tokenIn
    if (!previousSwap) {
      if (swap.assetIn !== tokenIn) {
        flipSwap(swap);
      }
    }
    // for last swap we check tokenOut
    else if (index === path.swaps.length - 1) {
      if (swap.assetOut !== tokenOut) {
        flipSwap(swap);
      }
    }
    // perform ordering based on previous swap output
    else {
      if (swap.assetIn !== previousSwap.assetOut) {
        flipSwap(swap);
      }
    }
    previousSwap = { ...swap };
  });
  return path;
};

/**
 * It switches the input and output assets in the swap.
 */
export const flipSwap = (swap: Swap): Swap => {
  const assetIn = swap.assetIn;
  swap.assetIn = swap.assetOut;
  swap.assetOut = assetIn;
  return swap;
};

/**
 * Builds a path from a route. A route is a set of pools all swaps go through.
 */
export const buildPath = (
  tokenIn: Asset,
  tokenOut: Asset,
  pools: Pool[]
): Path | undefined => {
  const tokens: string[] = [];
  // we can't allow duplicate entries for assets
  pools.forEach((pool) => {
    if (!tokens.includes(pool.assetInId)) tokens.push(pool.assetInId);

    if (!tokens.includes(pool.assetOutId)) tokens.push(pool.assetOutId);
  });
  const assets = tokens.map((token) => {
    return asAsset(token);
  });
  // create path accepts assets.length = n + 1, pools.length = n
  // eslint-disable-next-line prefer-const
  let path = createPath(assets, pools);
  
  // TODO: check how orderSwapsInPath behaves for direct swap (no hop)!
  // order swaps tokenIn and tokenOut accordingly
  //path = orderSwapsInPath(tokenIn, tokenOut, path);

  // sanity check
  throwForInvalidPath(path);

  // TODO: remove next block
  // sanity check that we start with tokenIn and end with tokenOut
  const tokenInMatches = path.swaps[0].assetIn.id === tokenIn.id;
  const tokenOutMatches = path.swaps.at(-1)!.assetOut.id === tokenOut.id;
  if (tokenInMatches && tokenOutMatches) return path;

  return undefined;
};

const asAsset = (id: string) => {
  return { id };
};

export function throwForInvalidPath(path: Path) {
  if (path.pools.length !== path.swaps.length)
    throw Error('Path is invalid. Not equal amount of Swaps and Pools');
}
