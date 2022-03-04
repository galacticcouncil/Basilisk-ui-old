import { DefinitionRpc } from '@polkadot/types/types';

/**
 * RPCs are exposed as a method on a specific module.
 * GetPoolAccount method is in the LBP module.
 */
export const getPoolAccount: DefinitionRpc = {
  description: 'Get pool account id by asset IDs',
  params: [
    {
      name: 'assetInId',
      type: 'u32',
    },
    {
      name: 'assetOutId',
      type: 'u32',
    },
  ],
  type: 'AccountId',
};
