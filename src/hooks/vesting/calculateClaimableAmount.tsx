import { ApiPromise } from '@polkadot/api';
import { Codec } from '@polkadot/types/types';
import BigNumber from 'bignumber.js';
import { find } from 'lodash';
import { VestingSchedule } from '../../generated/graphql';

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
 * Calculates original and future lock for given VestingSchedule.
 * https://gist.github.com/maht0rz/53466af0aefba004d5a4baad23f8ce26
 *
 * returns [originalLock, futureLock]
 */
export const calculateLock = (
  vesting: VestingSchedule,
  currentBlockNumber: string
): [BigNumber, BigNumber] => {
  const startPeriod = new BigNumber(vesting.start);
  const period = new BigNumber(vesting.period);

  // if the vesting has not started, number of periods is 0
  let numberOfPeriods = new BigNumber(currentBlockNumber)
    .minus(startPeriod)
    .dividedBy(period);
  numberOfPeriods = numberOfPeriods.isNegative()
    ? new BigNumber('0')
    : numberOfPeriods;

  const perPeriod = new BigNumber(vesting.perPeriod);
  const vestedOverPeriods = numberOfPeriods.multipliedBy(perPeriod);

  const periodCount = new BigNumber(vesting.periodCount);
  const originalLock = periodCount.multipliedBy(perPeriod);

  const unlocked = vestedOverPeriods.gte(originalLock)
    ? originalLock
    : vestedOverPeriods;
  const futureLock = originalLock.minus(unlocked);

  return [originalLock, futureLock];
};

/**
 * Calculates originalLock and futureLock for every vesting schedule and
 * sums it to total.
 */
export const calculateTotalLocks = (
  vestingSchedules: VestingSchedule[],
  currentBlockNumber: string
) => {
  /**
   * .reduce did not play well with an object that has multiple BigNumbers
   * that's why the summation runs twice.
   */
  const sumOriginalLock = vestingSchedules.reduce(
    (accumulator, vestingSchedule) => {
      const [originalLock] = calculateLock(vestingSchedule, currentBlockNumber);
      return accumulator.plus(originalLock);
    },
    new BigNumber(0)
  );

  const sumFutureLock = vestingSchedules.reduce(
    (accumulator, vestingSchedule) => {
      const [, futureLock] = calculateLock(vestingSchedule, currentBlockNumber);
      return accumulator.plus(futureLock);
    },
    new BigNumber(0)
  );

  return {
    original: sumOriginalLock.toString(),
    future: sumFutureLock.toString(),
  };
};
