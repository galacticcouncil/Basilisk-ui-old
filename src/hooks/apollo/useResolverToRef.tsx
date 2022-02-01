import { Resolver } from '@apollo/client';
import { useEffect, useRef } from 'react';
import log from 'loglevel';
import { onError } from './onError';

/**
 * Updates the resolver fn ref each time the given resolver fn changes.
 *
 * This is necessary to reflect changes made to functions within hooks
 * within the Apollo resolvers configuration.
 */
export const useResolverToRef = (resolver: Resolver, name?: string) => {
  const resolverRef = useRef(resolver);
  // when the resolver changes, update the ref
  useEffect(() => {
    resolverRef.current = resolver;
  }, [resolver]);

  return function resolverFromRef(...args: any[]) {
    // TODO is there a better way to debug resolvers? Since the function name
    // is not visible in the apollo error
    log.debug('Running resolver', name);
    // execute the wrapper resolver ref, with the given arguments from Apollo
    const errorWrappedResolver = () =>
      Promise.resolve()
        .then(() => resolverRef.current.apply(undefined, args as any))
        .catch(async (e) => {
          await onError({ error: e, name });
          throw e;
        });

    return errorWrappedResolver();
  };
};
