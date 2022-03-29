import { useCallback } from 'react';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';
import { Vec } from '@polkadot/types';
import { VestingScheduleOf } from '@open-web3/orml-types/interfaces';
import { find, first } from 'lodash';
import { ApiPromise } from '@polkadot/api';
import { Codec } from '@polkadot/types/types';
import { useApolloClient } from '@apollo/client';
import { readLastBlock } from '../lastBlock/readLastBlock';
import BigNumber from 'bignumber.js';
import constants from '../../constants';

export const balanceLockDataType = 'Vec<BalanceLock>';
export const tokensLockDataType = balanceLockDataType;

export const vestingBalanceLockId = 'ormlvest';

export const vestingScheduleDataType = 'Vec<VestingScheduleOf>';

export interface OrmlTokensBalanceLock {
  id?: string;
  amount?: number;
}

export const getLockedBalanceByAddressAndLockId = async (
  apiInstance: ApiPromise,
  address: string,
  lockId: string
) => {
  const lockedNativeBalance = find(
    apiInstance.createType(
      balanceLockDataType,
      await apiInstance.query.balances.locks(address)
    ),
    (lockedAmount) =>
      // lockedAmount.id.eq(lockId)
      false
  );

  const tokenBalanceLocks = (
    await apiInstance.query.tokens.locks.entries(address)
  ).map(([_storageKey, codec]: [any, Codec]) => {
    const tokenBalanceLock = (
      codec.toJSON() as any
    )[0] as unknown as OrmlTokensBalanceLock;
    return {
      id: tokenBalanceLock?.id,
      amount: tokenBalanceLock?.amount?.toString(),
    };
  });

  // TODO: get all balances for given lockId
  const lockedTokensBalance = find(
    tokenBalanceLocks,
    (lockedAmount) => lockedAmount?.id === lockId
  );
  // const lockedTokensBalances = tokenBalanceLocks.filter(
  //   (lockedAmount) => lockedAmount?.id === lockId
  // );

  return lockedNativeBalance || lockedTokensBalance;
};

/**
 * This function casts a number in string representation
 * to a BigNumber. If the input is undefined, it returns
 * a default value.
 */
const toBN = (numberAsString: string | undefined) => {
  if (!numberAsString) return new BigNumber(constants.defaultValue);
  return new BigNumber(numberAsString);
};

export const calculateFutureLock = (
  vestingSchedule: VestingScheduleOf,
  currentBlockNumber: BigNumber
) => {
  const startPeriod = toBN(vestingSchedule.start.toString());
  const period = toBN(vestingSchedule.period.toString());
  const numberOfPeriods = currentBlockNumber
    .minus(startPeriod)
    .dividedBy(period);

  const perPeriod = toBN(vestingSchedule.perPeriod.toString());
  const vestedOverPeriods = numberOfPeriods.multipliedBy(perPeriod);

  const periodCount = toBN(vestingSchedule.periodCount.toString());
  const originalLock = periodCount.multipliedBy(perPeriod);

  const futureLock = originalLock.minus(vestedOverPeriods);
  return futureLock;
};

export const useGetVestingScheduleByAddress = () => {
  const { apiInstance } = usePolkadotJsContext();
  const client = useApolloClient();

  const getVestingScheduleByAddress = useCallback(
    async (address?: string) => {
      if (!apiInstance || !address) return;

      // TODO: instead of multiple .createType calls, use the following
      // https://github.com/AcalaNetwork/acala.js/blob/9634e2291f1723a84980b3087c55573763c8e82e/packages/sdk-core/src/functions/getSubscribeOrAtQuery.ts#L4
      // TODO: iterate over all locks for given lockID
      const vestingSchedule = first(
        apiInstance.createType(
          vestingScheduleDataType,
          await apiInstance.query.vesting.vestingSchedules(address)
        ) as Vec<VestingScheduleOf>
      );

      const lockedVestingAmount = await getLockedBalanceByAddressAndLockId(
        apiInstance,
        address,
        vestingBalanceLockId
      );

      const relaychainBlockNumber = readLastBlock(client);
      const currentBlockNumber = toBN(
        relaychainBlockNumber?.lastBlock?.relaychainBlockNumber?.toString()
      );

      // TODO: apply to an array of locks
      const futureLock = calculateFutureLock(
        vestingSchedule!,
        currentBlockNumber
      );
      const remainingVestingAmount = lockedVestingAmount?.amount;
      const remainingVestingAmountBN = toBN(remainingVestingAmount?.toString());
      const claimableAmount = remainingVestingAmountBN.minus(futureLock);

      // TODO: are we sure this really conforms with the graphql VestingSchedule type
      // in all conditions?
      return {
        // TODO: add a claimableAmount (https://gist.github.com/maht0rz/53466af0aefba004d5a4baad23f8ce26)
        claimableAmount: claimableAmount.toString(),
        remainingVestingAmount: remainingVestingAmount?.toString(),
        start: vestingSchedule?.start.toString(),
        period: vestingSchedule?.period.toString(),
        periodCount: vestingSchedule?.periodCount.toString(),
        perPeriod: vestingSchedule?.perPeriod.toString(),
      };
    },
    [apiInstance, client]
  );

  return getVestingScheduleByAddress;
};
