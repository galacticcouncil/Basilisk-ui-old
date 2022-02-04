import {
  PersistedValidationData,
  SignedBlock,
} from '@polkadot/types/interfaces';
import { ApiPromise } from '@polkadot/api';
import { Option } from '@polkadot/types';
import { ApiDecoration } from '@polkadot/api/types';

export const validationDataDataType =
  'Option<PolkadotPrimitivesV1PersistedValidationData>';

// Extract to some common utils because we will need this
const getApiInstanceForSpecificBlock = async (
  apiInstance: ApiPromise,
  blockHash: string
): Promise<ApiDecoration<'promise'>> => {
  const apiInstanceSpecific = await apiInstance.at(blockHash);
  return apiInstanceSpecific;
};

// TODO: add test and extract to some common utils
// other files will need this in future
const getBlockHashString = (signedBlock: SignedBlock) => {
  const hash = signedBlock.block.header.hash.toString();
  return hash;
};

export const getValidationData = async (
  apiInstance: ApiPromise,
  parachainBlock: SignedBlock
) => {
  const blockHash = getBlockHashString(parachainBlock);
  const apiInstanceForSpecificBlock = await getApiInstanceForSpecificBlock(
    apiInstance,
    blockHash
  );
  const rawValidationData =
    await apiInstanceForSpecificBlock.query.parachainSystem.validationData();

  // shouldn't matter whether apiInstanceForSpecificBlock or apiInstance
  const validationDataOption = apiInstance.createType<
    Option<PersistedValidationData>
  >(validationDataDataType, rawValidationData);

  if (validationDataOption.isSome) {
    return validationDataOption.unwrap();
  }

  return null;
};
