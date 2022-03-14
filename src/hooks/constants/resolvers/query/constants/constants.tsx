import { Constants } from '../../../../../generated/graphql';

export const __typename: Constants['__typename'] = 'Constants';

const objectToInitialize = {} as Constants;

const withTypename = (constants: Constants) => ({
  __typename,
  ...constants,
});

const withId = (constants: Constants) => {
  constants.id = __typename;
  return constants;
};

export const useConstantsQueryResolver = () => {
  return {
    /**
     * We need to return an empty object with typename and id
     * for the Apollo client normalized cache.
     */
    constants: () => withTypename(withId(objectToInitialize)),
  };
};
