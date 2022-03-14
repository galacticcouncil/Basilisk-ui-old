import { useQuery } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { renderHook, RenderResult } from '@testing-library/react-hooks';
import { ReactNode } from 'react';
import { gql } from 'graphql.macro';
import { useConstantsQueryResolver, __typename } from './constants';
import { Constants } from '../../../../../generated/graphql';

describe('constants', () => {
  describe('useConstantsQueryResolver', () => {
    const useTestResolvers = () => {
      return {
        Query: {
          ...useConstantsQueryResolver(),
        },
      };
    };

    interface TestQueryResponse {
      constants: Constants;
    }
    const useTestQuery = () => {
      return useQuery<TestQueryResponse>(
        gql`
          query GetConstants {
            constants @client {
              __typename
              id
            }
          }
        `
      );
    };

    const renderHookOptions = (resolvers: RenderResult<any>) => {
      return {
        wrapper: (props: { children: ReactNode }) => {
          // 14.3.2022 ... https://github.com/testing-library/eslint-plugin-testing-library/issues/386
          // eslint-disable-next-line testing-library/no-node-access
          const children = props.children;
          return (
            <MockedProvider resolvers={resolvers.current}>
              {children}
            </MockedProvider>
          );
        },
      };
    };

    it('can resolve the query within the rendered component', async () => {
      const { result: resolvers } = renderHook(() => useTestResolvers());

      const { result: query, waitForNextUpdate } = renderHook(
        () => useTestQuery(),
        renderHookOptions(resolvers)
      );

      await waitForNextUpdate();
      expect(query.current.data).toEqual({
        constants: {
          __typename: __typename, // 'Constants'
          id: __typename,
        },
      });
    });
  });
});
