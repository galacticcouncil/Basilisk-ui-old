import { PersistedValidationData } from '@polkadot/types/interfaces';
import { useEffect, useState } from 'react';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';

export const validationDataDataType =
  'Option<PolkadotPrimitivesV1PersistedValidationData>';

export const useValidationData = () => {
  const { apiInstance } = usePolkadotJsContext();

  const [validationData, setValidationData] =
    useState<PersistedValidationData | null>();

  useEffect(() => {
    if (!apiInstance) {
      return;
    }

    const getValidationData = async () => {
      const validationData =
        await apiInstance.query.parachainSystem.validationData();

      const validationDataOption = apiInstance.createType(
        validationDataDataType,
        validationData
      );

      if (validationDataOption.isSome) {
        const validationData =
          validationDataOption.toJSON() as unknown as PersistedValidationData;

        setValidationData(validationData);
      }
    };

    getValidationData();
  }, [apiInstance]);

  return validationData;
};
