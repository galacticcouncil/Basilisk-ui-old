import { ApiPromise } from '@polkadot/api';
import { SignedBlock } from '@polkadot/types/interfaces';
import { LastBlock } from '../../../generated/graphql';
import { getParachainNumber, getRelaychainNumber } from '../useLastBlock';
import { getValidationData } from './getValidationData';

export type PartialLastBlock = Omit<LastBlock, 'id'>;
export type Callback = (lastBlock: PartialLastBlock) => void;

export type HandleNotifyNewBlockDeps = {
  apiInstance: ApiPromise;
};

export const makeHandleNotifyNewBlock =
  ({ apiInstance }: HandleNotifyNewBlockDeps) =>
  (callback: Callback) =>
  async (block: SignedBlock) => {
    console.log('useLastBlock', 'subscribeNewBlocks', 'new block');

    const parachain = getParachainNumber(block);

    const validationData = await getValidationData(apiInstance, block);

    if (!validationData) return;

    const relaychain = getRelaychainNumber(validationData);

    callback({
      relaychain,
      parachain,
    });
  };
