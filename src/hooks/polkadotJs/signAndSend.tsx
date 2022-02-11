import { ApolloCache } from '@apollo/client';
import { ApiPromise } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { DispatchError, EventRecord } from '@polkadot/types/interfaces';
import {
  Callback,
  ISubmittableResult,
  RegistryError,
} from '@polkadot/types/types';
import { readActiveAccount } from '../accounts/lib/readActiveAccount';

export type ExtrinsicErrors = RegistryError | DispatchError;

export const parseExtrinsicErrors = (
  events: EventRecord[],
  apiInstance: ApiPromise
): ExtrinsicErrors[] =>
  events
    .filter(({ event }) => apiInstance.events.system.ExtrinsicFailed.is(event))
    // we know that data for system.ExtrinsicFailed is
    // (DispatchError, DispatchInfo)
    .reduce((acc: ExtrinsicErrors[], { event: { data } }) => {
      const error: DispatchError = data[0] as DispatchError;
      if (error.isModule) {
        // for module errors, we have the section indexed, lookup
        const decoded = apiInstance.registry.findMetaError(error.asModule);
        acc.push(decoded);

        const { docs, method, section } = decoded;
        console.error(`${section}.${method}: ${docs.join(' ')}`);
      } else {
        // Other, CannotLookup, BadOrigin, no extra info
        acc.push(error);

        console.error(error.toString());
      }

      return acc;
    }, []);

export const signAndSend = async (
  cache: ApolloCache<object>,
  transaction: SubmittableExtrinsic<'promise', ISubmittableResult>,
  apiInstance: ApiPromise
) => {
  const address = readActiveAccount(cache);
  // if for some reason the UI tries to send a transaction, and there is no active account selected
  if (!address) {
    throw new Error('No active account found');
  }
  const { signer } = await web3FromAddress(address.id);

  return new Promise<null>(async (resolve, reject) => {
    const statusHandler: Callback<ISubmittableResult> = ({
      status,
      events,
    }) => {
      if (!status.isInBlock) {
        return;
      }
      const errors = parseExtrinsicErrors(events, apiInstance);

      if (errors.length > 0) {
        reject({ errors });
      } else {
        resolve(null);
      }

      if (unsub) {
        unsub();
      }
    };

    const unsub = await transaction.signAndSend(
      address.id,
      { signer },
      statusHandler
    );
  });
};
