import { AccountId, BlockNumber } from '@open-web3/orml-types/interfaces';
import { ApiPromise } from '@polkadot/api';
import '@polkadot/api-augment';
import { StorageKey, Struct, u32 } from '@polkadot/types';

type AssetPair = {
  asset_in: String;
  asset_out: String;
};
type LBPWeight = u32;
type WeightCurveType = {
  _enum: ['Linear'];
};
type Fee = {
  numerator: u32;
  denominator: u32;
};
interface LBPPoolData extends Struct {
  //readonly amount: Balance;
  readonly owner: AccountId;
  readonly start: BlockNumber;
  readonly end: BlockNumber;
  readonly assets: AssetPair;
  readonly initialWeight: LBPWeight;
  readonly finalWeight: LBPWeight;
  readonly weightCurve: WeightCurveType;
  readonly fee: Fee;
  readonly feeCollector: AccountId;
}

export const getAllLbpPools = async (apiInstance: ApiPromise) => {
  const results = await apiInstance.query.lbp.poolData.entries<LBPPoolData>();

  results.map(([address, lbpPoolData]: [StorageKey, any]) => {
    console.log(address.toHuman()); // =>  [ 'bXiWm9TE6YXY9mpPeFK8NwjEgMdfmmBdstx33YskqLYvK6dZx' ]
    console.log(lbpPoolData.toRawType()); // => Option<PalletLbpPool>
    const lbpPool = apiInstance.createType('PalletLbpPool', lbpPoolData);
    console.log(lbpPool.owner.toHuman()); // bXgbR3K8BpV7Dn9imvyriviptpwAsaQyq1W6GLa77FJVqdyja correct
    console.log(lbpPool.assets.toHuman()); // ['0', '0'] WRONG
    console.log(lbpPool.feeCollector.toString()); // bXgbR3K8BpV7Dn9imvyriviptpwAsaQyq1W6GLa77FJVqdyja
    // rest is broken

    // =>
    // owner: [Getter],
    // start: [Getter],
    // end: [Getter],
    // assets: [Getter],
    // initialWeight: [Getter],
    // finalWeight: [Getter],
    // weightCurve: [Getter],
    // fee: [Getter],
    // feeCollector: [Getter],
    // repayTarget: [Getter]
    return address;
  });
};
