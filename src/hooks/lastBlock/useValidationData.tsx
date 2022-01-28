import { PersistedValidationData } from '@polkadot/types/interfaces';
import { useEffect, useState } from 'react';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';

export const validationDataDataType =
  'Option<PolkadotPrimitivesV1PersistedValidationData>';

export const useValidationData = () => {
  const { apiInstance, loading } = usePolkadotJsContext();

  const [validationData, setValidationData] =
    useState<PersistedValidationData | null>();

  useEffect(() => {
    if (!apiInstance) {
      return;
    }

    if (loading) {
      return;
    }

    const getValidationData = async () => {
      const rawValidationData =
        await apiInstance.query.parachainSystem.validationData();

      const validationDataOption = apiInstance.createType(
        validationDataDataType,
        rawValidationData
      );

      if (validationDataOption.isSome) {
        const jsonValidationData =
          validationDataOption.toJSON() as unknown as PersistedValidationData;

        setValidationData(jsonValidationData);
      }
    };

    getValidationData();
  }, [apiInstance, loading]);

  return validationData;
};
