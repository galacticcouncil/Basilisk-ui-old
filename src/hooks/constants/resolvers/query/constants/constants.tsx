import { Constants } from '../../../../../generated/graphql';

export const __typename: Constants['__typename'] = 'Constants';
const id = 'constantsId';
const withTypenameAndId = () => ({
  __typename,
  id,
});

export const useConstantsQueryResolver = () => {
  return {
    constants: () => withTypenameAndId(),
  };
};
