import { Constants } from '../../../../../generated/graphql';

export const __typename: Constants['__typename'] = 'Constants';

const withTypename = (obj: {}) => ({
  __typename,
  ...obj,
});

const withId = (obj: {}) => ({
  id: __typename,
  ...obj,
});

export const useConstantsQueryResolver = () => {
  return {
    constants: () => withTypename(withId({})),
  };
};
