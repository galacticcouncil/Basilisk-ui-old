import { Asset, Pool } from '../../generated/graphql'

export type Path = {
  id: string // address(es) of XYK Pool(s)
  swaps: Swap[]
  pools: Pool[]
}

export type Swap = {
  id: string // pool ID
  assetIn: Asset
  assetOut: Asset
  //   swapAmount?: string;
  //   limitReturnAmount?: string;
  //   maxPrice?: string;
}

export enum SwapTypes {
  SwapExactIn,
  SwapExactOut
}
