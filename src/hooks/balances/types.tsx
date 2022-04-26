import { AnyTuple } from '@polkadot/types/types';

type address = string;
type assetId = string;
export interface lockedBalanceStorageKey extends AnyTuple {
  args?: [address, assetId];
}
