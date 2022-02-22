import { Resolvers } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import {
  GetActiveAccountQueryResponse,
  useGetActiveAccountQuery,
} from '../../queries/useGetActiveAccountQuery';
import TestRenderer, { act } from 'react-test-renderer';
import { useActiveAccountQueryResolver } from './activeAccount';
import waitForExpect from 'wait-for-expect';
import { usePersistActiveAccount } from '../../lib/usePersistActiveAccount';

jest.mock('../../lib/usePersistActiveAccount');
const mockUsePersistActiveAccount = usePersistActiveAccount as jest.Mock;

// test component that returns the query result(s)
const Test = () => {
  const { data } = useGetActiveAccountQuery();
  return <>{JSON.stringify(data)}</>;
};

const expectedAccountMock = {
  id: 'mockId',
  name: 'Mocked Account',
  source: 'polkadot-js',
  balances: [],
};

const useResolvers = () => {
  return {
    Query: {
      ...useActiveAccountQueryResolver(),
      accounts: () => {
        return [expectedAccountMock];
      },
    },
  };
};

// testing helper to wrap a testing component into a provider with configured resolvers
export const resolverProviderFactory =
  (useResolvers: () => Resolvers) =>
  ({ children }: { children: React.ReactNode }) => {
    return (
      <MockedProvider resolvers={useResolvers()}>{children}</MockedProvider>
    );
  };

describe('useActiveAccountQueryResolver', () => {
  // rendered 'Test' component wrapped in a 'MockedProvider'
  let component: TestRenderer.ReactTestRenderer;
  // function to parse / cast the rendering result of 'Test' into the required testing data
  let data: () => GetActiveAccountQueryResponse | undefined = () =>
    JSON.parse(component.toJSON() as unknown as string);

  // combine resolvers and the 'Test' component and render them
  const render = () => {
    const ResolverProvider = resolverProviderFactory(useResolvers);
    component = TestRenderer.create(
      <ResolverProvider>
        <Test />
      </ResolverProvider>
    );
  };

  afterEach(() => {
    jest.resetModules();
  });

  describe('falsy case', () => {
    beforeEach(() => {
      mockUsePersistActiveAccount.mockImplementationOnce(() => [null]);
    });

    it('should resolve the activeAccount as null when no persistedActiveAccountId if found', async () => {
      render();

      await act(async () => {
        await waitForExpect(() => {
          expect(data()?.activeAccount).toBe(null);
        });
      });
    });
  });

  describe('truthy case', () => {
    describe('persistedActiveAccountId is found and account with given Id is returned from Polkadot.js', () => {
      beforeEach(() => {
        mockUsePersistActiveAccount.mockImplementationOnce(() => {
          return { persistedActiveAccount: { id: 'mockId' } };
        });
      });

      it('should resolve the activeAccount as account object when', async () => {
        render();

        await act(async () => {
          await waitForExpect(() => {
            expect(data()?.activeAccount).toStrictEqual({
              ...expectedAccountMock,
              __typename: 'Account',
            });
          });
        });
      });
    });
    describe('persistedActiveAccountId is found but no account with given Id is returned from Polkadot.js', () => {
      beforeEach(() => {
        mockUsePersistActiveAccount.mockImplementationOnce(() => [
          { id: 'nonExistingMockId' },
        ]);
      });

      it('should resolve the activeAccount as null', async () => {
        render();

        await act(async () => {
          await waitForExpect(() => {
            expect(data()?.activeAccount).toStrictEqual(null);
          });
        });
      });
    });
  });
});
