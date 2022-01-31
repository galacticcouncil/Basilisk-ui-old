import { MockedProvider } from '@apollo/client/testing';
import { useExtensionQueryResolver } from './extension';
import TestRenderer, { act } from 'react-test-renderer';
import { Resolvers } from '@apollo/client';
import {
  GetExtensionQueryResponse,
  useGetExtensionQuery,
} from '../../queries/useGetExtensionQuery';
import {
  mockInjectedWeb3,
  clearMockInjectedWeb3,
} from '../../lib/getExtension.test';
import waitForExpect from 'wait-for-expect';

// test component that returns the query result(s)
const Test = () => {
  const { data } = useGetExtensionQuery();
  return <>{JSON.stringify(data)}</>;
};

// configure resolvers for testing purposes
const useResolvers = () => {
  return {
    Query: {
      ...useExtensionQueryResolver(),
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

describe('extension', () => {
  // rendered 'Test' component wrapped in a 'MockedProvider'
  let component: TestRenderer.ReactTestRenderer;
  // function to parse / cast the rendering result of 'Test' into the required testing data
  let data: () => GetExtensionQueryResponse | undefined = () =>
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

  beforeEach(() => clearMockInjectedWeb3());

  describe('truthy case', () => {
    beforeEach(() => {
      // mock the extension resolver internals in order to change the query result
      mockInjectedWeb3(false);
      // eslint-disable-next-line testing-library/no-render-in-setup
      render();
    });

    it('should resolve the `isAvailable` as false field for the extension entity', async () => {
      await act(async () => {
        await waitForExpect(() => {
          expect(data()?.extension.isAvailable).toBe(false);
        });
      });
    });
  });

  describe('falsey case', () => {
    beforeEach(() => {
      mockInjectedWeb3(true);
      // eslint-disable-next-line testing-library/no-render-in-setup
      render();
    });

    it('should resolve the `isAvailable` as true field for the extension entity', async () => {
      await act(async () => {
        waitForExpect(() => {
          expect(data()?.extension.isAvailable).toBe(true);
        });
      });
    });
  });
});
