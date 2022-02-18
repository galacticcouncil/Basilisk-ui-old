export const getPoolAccount = {
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
