import {
  PersistedValidationData,
  SignedBlock,
} from '@polkadot/types/interfaces';
import { ApiPromise } from '@polkadot/api';

export const validationDataDataType =
  'Option<PolkadotPrimitivesV1PersistedValidationData>';

export const getValidationData = async (
  apiInstance: ApiPromise,
  parachainBlock: SignedBlock
) => {
  const rawValidationData = await (
    await apiInstance.at(parachainBlock.block.header.hash)
  ).query.parachainSystem.validationData();

  const validationDataOption = apiInstance.createType(
    validationDataDataType,
    rawValidationData
  );

  if (validationDataOption.isSome) {
    const jsonValidationData =
      validationDataOption.toJSON() as unknown as PersistedValidationData;

    return jsonValidationData;
  }

  return null;
};
