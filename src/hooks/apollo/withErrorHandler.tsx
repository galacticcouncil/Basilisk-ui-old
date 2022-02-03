import { Resolver } from '@apollo/client';
import log from 'loglevel';
import { onError } from './onError';

export function withErrorHandler(resolver: Resolver, name?: string) {
  return (...args: any[]) => {
    // TODO is there a better way to debug resolvers? Since the function name
    // is not visible in the apollo error
    log.debug('Running resolver', name);

    return Promise.resolve()
      .then(() => resolver.apply(undefined, args as any))
      .catch(async (e) => {
        await onError({ error: e, name });
        throw e;
      });
  }
};
