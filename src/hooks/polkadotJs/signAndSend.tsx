import { ApolloCache } from '@apollo/client';
import { ApiPromise } from '@polkadot/api';
import { ApiTypes, SubmittableExtrinsic } from '@polkadot/api/types';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { DispatchError } from '@polkadot/types/interfaces';
import {
  Callback,
  ISubmittableResult,
  RegistryError,
} from '@polkadot/types/types';
import { readActiveAccount } from '../accounts/lib/readActiveAccount';

export type Errors = (RegistryError | DispatchError)[];

export const signAndSend = async (
  cache: ApolloCache<object>,
  transaction: SubmittableExtrinsic<ApiTypes, ISubmittableResult>,
  api: ApiPromise
) => {
  const address = readActiveAccount(cache);
  // if for some reason the UI tries to send a transaction, and there is no active account selected
  if (!address) {
    throw new Error('No active account found');
  }
  const { signer } = await web3FromAddress(address.id);

  let reject: (value: { errors: Errors }) => void;
  let resolve: (value?: unknown) => void;
  const resultPromise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  const statusHandler: Callback<ISubmittableResult> = ({ status, events }) => {
    if (!status.isInBlock) {
      return;
    }

    const errors = events
      .filter(({ event }) => api.events.system.ExtrinsicFailed.is(event))
      // we know that data for system.ExtrinsicFailed is
      // (DispatchError, DispatchInfo)
      .reduce((acc: Errors, { event: { data } }) => {
        const error: DispatchError = data[0] as DispatchError;
        if (error.isModule) {
          // for module errors, we have the section indexed, lookup
          const decoded = api.registry.findMetaError(error.asModule);
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

    if (errors.length > 0) {
      reject({ errors });
    } else {
      resolve();
    }
  };

  const sub = transaction.signAndSend(address.id, { signer }, statusHandler);

  console.log({ sub });

  return resultPromise;
};
