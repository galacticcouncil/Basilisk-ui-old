import { gql, Resolvers, useQuery } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { ApiPromise } from '@polkadot/api';
import TestRenderer, { act } from 'react-test-renderer';
import waitForExpect from 'wait-for-expect';
import errors from '../../../../../errors';
import {
  lbpPoolsQueryResolverFactory,
  useLbpPoolQueryResolvers,
  __typename,
} from './lbpPools';

const address = 'bXiWm9TE6YXY9mpPeFK8NwjEgMdfmmBdstx33YskqLYvK6dZxs';
const assetAId = '0';
const assetBId = '1';

jest.mock('../../../../polkadotJs/usePolkadotJs', () => ({
  usePolkadotJsContext: () => {
    return { apiInstance: jest.fn() };
  },
}));

jest.mock('../../lib/getAllLbpPools', () => ({
  getAllLbpPools: () => {
    return [
      {
        id: address,
        assetInId: assetAId,
        assetOutId: assetBId,
      },
    ];
  },
}));
describe('lbpPoolsQueryResolverFactory', () => {
  it('fails to fetch without PolkadotJS ApiPromise', async () => {
    const brokenApiInstance = undefined as unknown as ApiPromise;
    const lbpPoolsQueryResolver = await lbpPoolsQueryResolverFactory(
      brokenApiInstance
    );

    const lbpPoolsQueryResolverPromise = lbpPoolsQueryResolver();

    await expect(lbpPoolsQueryResolverPromise).rejects.toMatchObject(
      Error(errors.apiInstanceNotInitialized)
    );
  });
});
describe('useLbpPoolQueryResolvers', () => {
  const useResolvers = () => {
    const lbpPoolQueryResolver = useLbpPoolQueryResolvers();
    return {
      Query: {
        ...lbpPoolQueryResolver,
      },
    };
  };

  // testing helper to wrap a testing component into a provider with configured resolvers
  const resolverProviderFactory =
    (useResolvers: () => Resolvers) =>
    ({ children }: { children: React.ReactNode }): JSX.Element => {
      return (
        <MockedProvider resolvers={useResolvers()}>{children}</MockedProvider>
      );
    };

  interface TestQueryResponse {
    lbpPools: { id: string; assetInId: string; assetOutId: string }[];
  }
  const Test = () => {
    const { data } = useQuery<TestQueryResponse>(
      gql`
        query GetLbpPools {
          lbpPools @client {
            id
            assetInId
            assetOutId
          }
        }
      `
    );

    return <>{JSON.stringify(data)}</>;
  };

  let component: TestRenderer.ReactTestRenderer;
  // combine resolvers and the 'Test' component and render them
  const render = () => {
    const ResolverProvider = resolverProviderFactory(useResolvers);
    component = TestRenderer.create(
      <ResolverProvider>
        <Test />
      </ResolverProvider>
    );
  };

  let data: () => TestQueryResponse | undefined = () =>
    JSON.parse(component.toJSON() as unknown as string);

  it('can resolve the query within the rendered component', async () => {
    render();

    await act(async () => {
      await waitForExpect(() => {
        expect(data()?.lbpPools).toEqual([
          {
            id: address,
            assetInId: assetAId,
            assetOutId: assetBId,
            __typename,
          },
        ]);
      });
    });
  });
});
