import { Constants } from '../../../../../generated/graphql';

export type ConstantsQueryResolver = () => {
  constants: () => Pick<Constants, '__typename' | 'id'>;
};

export const __typename: Constants['__typename'] = 'Constants';

const withTypename = (
  constants: Pick<Constants, 'id'>
): Pick<Constants, '__typename' | 'id'> => ({
  ...constants,
  __typename,
});

const constants: Pick<Constants, 'id'> = {
  id: __typename,
};

export const useConstantsQueryResolver: ConstantsQueryResolver = () => {
  return {
    /**
     * We need to return a wrapper object with typename and id
     * for the Apollo client normalized cache.
     */
    constants: () => withTypename(constants),
  };
};
