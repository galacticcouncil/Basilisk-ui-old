import { ApiPromise } from '@polkadot/api';
import { Codec } from '@polkadot/types/types';
import BigNumber from 'bignumber.js';
import { find } from 'lodash';
import errors from '../../errors';
import { VestingSchedule } from './useGetVestingByAddress';

export const balanceLockDataType = 'Vec<BalanceLock>';
export const tokensLockDataType = balanceLockDataType;

export interface OrmlTokensBalanceLock {
  id?: string;
  amount?: number;
}

export type LockedTokens =
  | {
      id: string | undefined;
      amount: string | undefined;
    }
  | undefined;
export const vestingBalanceLockId = 'ormlvest';

// TODO refactor following function to its own file or remove this and use implementation from issue #57
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
    (lockedAmount) => lockedAmount.id.eq(lockId)
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
 * to a BigNumber.
 */
export const toBN = (numberAsString: string) => {
  return new BigNumber(numberAsString);
};

/**
 * Calculates original and future lock for given VestingSchedule.
 * https://gist.github.com/maht0rz/53466af0aefba004d5a4baad23f8ce26
 */
export const calculateLock = (
  vestingSchedule: VestingSchedule,
  currentBlockNumber: string
): [BigNumber, BigNumber] => {
  // check for undefined property in vestingSchedule
  if (
    !vestingSchedule.perPeriod ||
    !vestingSchedule.period ||
    !vestingSchedule.periodCount ||
    !vestingSchedule.start
  )
    throw Error(errors.vestingScheduleIncomplete);

  const startPeriod = toBN(vestingSchedule.start);
  const period = toBN(vestingSchedule.period);
  const numberOfPeriods = toBN(currentBlockNumber)
    .minus(startPeriod)
    .dividedBy(period);

  const perPeriod = toBN(vestingSchedule.perPeriod);
  const vestedOverPeriods = numberOfPeriods.multipliedBy(perPeriod);

  const periodCount = toBN(vestingSchedule.periodCount);
  const originalLock = periodCount.multipliedBy(perPeriod);

  const futureLock = originalLock.minus(vestedOverPeriods);

  return [originalLock, futureLock];
};

export const calculateTotalLocks = (
  vestingSchedules: VestingSchedule[],
  currentBlockNumber: string
) => {
  // calculate originalLock and futureLock for every vesting schedule and sum to total
  const total = vestingSchedules.reduce(
    function (total, vestingSchedule) {
      const [originalLock, futureLock] = calculateLock(
        vestingSchedule,
        currentBlockNumber
      );

      total.original.plus(originalLock);
      total.future.plus(futureLock);

      return total;
    },
    { original: toBN('0'), future: toBN('0') }
  );

  return {
    original: total.original.toString(),
    future: total.future.toString(),
  };
};
