import { useLbpPoolQueryResolvers } from './query/lbpPools';

export const useLbpPoolsResolvers = () => {
  return {
    Query: {
      ...useLbpPoolQueryResolvers(),
    },
  };
};
