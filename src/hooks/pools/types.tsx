import { AccountId, BlockNumber } from '@open-web3/orml-types/interfaces';
import { Struct, u128, u32 } from '@polkadot/types';

type LBPWeight = u32;
type PalletLbpWeightCurveType = {
  _enum: ['Linear'];
};

type numerator = u32;
type denominator = u32;
type assetA = u32;
type assetB = u32;

export interface PalletLbpPool extends Struct {
  //readonly amount: Balance;
  readonly owner: AccountId;
  readonly start?: BlockNumber;
  readonly end?: BlockNumber;
  readonly assets: [assetA, assetB];
  readonly initialWeight: LBPWeight;
  readonly finalWeight: LBPWeight;
  readonly weightCurve: PalletLbpWeightCurveType;
  readonly fee: [numerator, denominator];
  readonly feeCollector: AccountId;
  readonly repayTarget: u128;
}
