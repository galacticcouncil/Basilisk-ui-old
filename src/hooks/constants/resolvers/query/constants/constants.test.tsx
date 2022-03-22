import { useConstantsQueryResolver, __typename } from './constants';

describe('constants', () => {
  const { constants } = useConstantsQueryResolver();

  it('returns a wrapper object with typename and id for the Apollo client normalized cache', () => {
    const wrapper = constants();
    expect(wrapper).toEqual({
      __typename: __typename, // 'Constants'
      id: __typename,
    });
  });
});
