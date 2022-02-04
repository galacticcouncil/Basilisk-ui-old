import {
  ApolloClient,
  NormalizedCacheObject,
  Resolvers,
  useApolloClient,
  useQuery,
} from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import TestRenderer, { act } from 'react-test-renderer';
import { gql } from 'graphql.macro';
import waitForExpect from 'wait-for-expect';
import {
  GetLastBlockQueryResponse,
  GET_LAST_BLOCK,
  useLastBlockQuery,
} from './queries/useLastBlockQuery';
import { useRefetchWithNewBlock } from './useRefetchWithNewBlock';
import { useLastBlock } from './useLastBlock';
import { useEffect } from 'react';
import { Query } from '../../generated/graphql';

const useLastBlockMock = useLastBlock as jest.Mock;

waitForExpect.defaults.interval = 10;
waitForExpect.defaults.timeout = 1000;

jest.mock('./useLastBlock', () => {
  return {
    useLastBlock: jest.fn(),
  };
});

describe('hooks/lastBlock/useRefetchWithNewBlock', () => {
  const resolverProviderFactory =
    (useResolvers: () => Resolvers) =>
    ({ children }: { children: React.ReactNode }): JSX.Element => {
      return (
        <MockedProvider resolvers={useResolvers()}>{children}</MockedProvider>
      );
    };

  describe('writes to cache and potentially refetch queries', () => {
    let spyApolloCache: jest.SpyInstance;
    let spyApolloRefetchQueries: jest.SpyInstance;

    const useResolvers = () => {
      return {};
    };
    const ResolverProvider = resolverProviderFactory(useResolvers);

    const Test = () => {
      const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
      useEffect(() => {
        if (client) {
          spyApolloCache = jest.spyOn(client.cache, 'writeQuery');
          spyApolloRefetchQueries = jest.spyOn(client, 'refetchQueries');
        }
      });
      useRefetchWithNewBlock(client);
      const { data } = useQuery<GetLastBlockQueryResponse>(GET_LAST_BLOCK);

      return <>{JSON.stringify(data)}</>;
    };

    let component: TestRenderer.ReactTestRenderer;

    const render = () => {
      component = TestRenderer.create(
        <ResolverProvider>
          <Test />
        </ResolverProvider>
      );
    };

    let data: () => GetLastBlockQueryResponse | undefined = () =>
      JSON.parse(component.toJSON() as unknown as string);

    beforeEach(() => {
      jest.resetModules();
    });

    it('can resolve lastBlock query', async () => {
      const exampleLastBlock = {
        __typename: 'LastBlock',
        relaychain: '10',
        parachain: '100',
      };

      useLastBlockMock.mockReturnValue({
        id: 'LastBlock',
        ...exampleLastBlock,
      });

      render();

      await act(async () => {
        await waitForExpect(() => {
          expect(data()).toEqual({
            lastBlock: {
              ...exampleLastBlock,
            },
          });
        });
      });

      expect(spyApolloCache).toHaveBeenCalledTimes(1);
      expect(spyApolloRefetchQueries).not.toBeCalled();
    });

    it('can resolve lastBlock query 2', async () => {
      const exampleLastBlock = {
        __typename: 'LastBlock',
        relaychain: '10',
        parachain: '100',
      };

      useLastBlockMock.mockReturnValue({
        id: 'LastBlock',
        ...exampleLastBlock,
      });

      render();

      await act(async () => {
        await waitForExpect(() => {
          expect(data()).toEqual({
            lastBlock: { ...exampleLastBlock },
          });
        });
      });

      expect(spyApolloCache).toHaveBeenCalledTimes(1);

      const exampleNextLastBlock = {
        __typename: 'LastBlock',
        relaychain: '10',
        parachain: '100',
      };

      useLastBlockMock.mockReturnValue({
        id: 'LastBlock',
        ...exampleNextLastBlock,
      });

      await act(async () => {
        component.update(
          <ResolverProvider>
            <Test />
          </ResolverProvider>
        );
        await waitForExpect(() => {
          expect(data()).toEqual({
            lastBlock: { ...exampleNextLastBlock },
          });
        });
      });

      expect(spyApolloCache).toHaveBeenCalledTimes(2);
      expect(spyApolloRefetchQueries).toHaveBeenCalledTimes(1);
    });
  });

  describe('query only reads from cache', () => {
    const mockedQueryResolver = jest.fn().mockReturnValue({
      id: 'mockedLasBlock',
      __typename: 'LastBlock',
    });

    const useResolvers = () => {
      return {
        Query: {
          lastBlock: mockedQueryResolver,
        },
      };
    };

    const Test = () => {
      const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
      useRefetchWithNewBlock(client);
      const { data } = useLastBlockQuery();

      return <>{JSON.stringify(data)}</>;
    };

    let component: TestRenderer.ReactTestRenderer;
    const ResolverProvider = resolverProviderFactory(useResolvers);
    const render = () => {
      component = TestRenderer.create(
        <ResolverProvider>
          <Test />
        </ResolverProvider>
      );
    };

    let data: () => GetLastBlockQueryResponse | undefined = () =>
      JSON.parse(component.toJSON() as unknown as string);

    beforeEach(() => {
      jest.resetModules();
    });

    it('hits only cache, not resolver', async () => {
      const exampleLastBlock = {
        __typename: 'LastBlock',
        relaychain: '10',
        parachain: '100',
      };

      useLastBlockMock.mockReturnValue({
        id: 'LastBlock',
        ...exampleLastBlock,
      });

      render();

      await act(async () => {
        await waitForExpect(() => {
          expect(data()).toEqual({
            lastBlock: {
              ...exampleLastBlock,
            },
          });
        });
      });

      expect(mockedQueryResolver).not.toBeCalled();
    });
  });

  describe('hits just the lastBlock refetch, not other query fields', () => {
    const exampleMockEntity = {
      id: 'mockEntity',
      __typename: 'MockEntity',
    };
    let mockedQueryResolver: jest.Mock;

    const useResolvers = () => {
      mockedQueryResolver = jest
        .fn()
        .mockImplementation(() => exampleMockEntity);

      return {
        Query: {
          mockEntity: mockedQueryResolver,
        },
        MockEntity: {},
      };
    };
    const ResolverProvider = resolverProviderFactory(useResolvers);

    interface TestQueryResponse {
      lastBlock: Query['lastBlock'];
      mockEntity: { id: string };
    }

    const Test = () => {
      const client = useApolloClient() as ApolloClient<NormalizedCacheObject>;
      useRefetchWithNewBlock(client);
      const { data } = useQuery<TestQueryResponse>(gql`
        query TestQuery {
          mockEntity @client {
            id
          }
          lastBlock @client {
            parachain
            relaychain
          }
        }
      `);

      return <>{JSON.stringify(data)}</>;
    };

    let component: TestRenderer.ReactTestRenderer;

    const render = () => {
      component = TestRenderer.create(
        <ResolverProvider>
          <Test />
        </ResolverProvider>
      );
    };

    let data: () => GetLastBlockQueryResponse | undefined = () =>
      JSON.parse(component.toJSON() as unknown as string);

    beforeEach(() => {
      jest.resetModules();
    });

    it('mocked query resolver is triggered only once', async () => {
      const exampleLastBlock = {
        __typename: 'LastBlock',
        relaychain: '10',
        parachain: '100',
      };

      useLastBlockMock.mockReturnValue({
        id: 'LastBlock',
        ...exampleLastBlock,
      });

      render();

      await act(async () => {
        await waitForExpect(() => {
          expect(data()).toEqual(
            expect.objectContaining({
              lastBlock: { ...exampleLastBlock },
              mockEntity: { ...exampleMockEntity },
            })
          );
        });
      });

      expect(mockedQueryResolver).toHaveBeenCalledTimes(1);

      const exampleNextLastBlock = {
        __typename: 'LastBlock',
        relaychain: '10',
        parachain: '101',
      };

      useLastBlockMock.mockReturnValue({
        id: 'LastBlock',
        ...exampleNextLastBlock,
      });

      await act(async () => {
        component.update(
          <ResolverProvider>
            <Test />
          </ResolverProvider>
        );
        await waitForExpect(() => {
          expect(data()).toEqual(
            expect.objectContaining({
              lastBlock: { ...exampleNextLastBlock },
              mockEntity: { ...exampleMockEntity },
            })
          );
        });
      });

      expect(mockedQueryResolver).toHaveBeenCalledTimes(0);
    });
  });
});
