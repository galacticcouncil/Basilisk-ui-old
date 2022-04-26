import { ApiPromise } from '@polkadot/api';
import { BalanceLock } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import BigNumber from 'bignumber.js';
import { find } from 'lodash';
import constants from '../../constants';
import { VestingSchedule } from './useGetVestingScheduleByAddress';

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
export const toBN = (numberAsString: string | undefined) => {
  // TODO: check if it is any good to use default values
  // on undefined VestingSchedule properties!
  if (!numberAsString) return new BigNumber(constants.defaultValue);
  return new BigNumber(numberAsString);
};

// https://gist.github.com/maht0rz/53466af0aefba004d5a4baad23f8ce26
// TODO: check if calc makes sense for undefined VestingSchedule properties
export const calculateFutureLock = (
  vestingSchedule: VestingSchedule,
  currentBlockNumber: BigNumber
) => {
  const startPeriod = toBN(vestingSchedule.start);
  const period = toBN(vestingSchedule.period);
  const numberOfPeriods = currentBlockNumber
    .minus(startPeriod)
    .dividedBy(period);

  const perPeriod = toBN(vestingSchedule.perPeriod);
  const vestedOverPeriods = numberOfPeriods.multipliedBy(perPeriod);

  const periodCount = toBN(vestingSchedule.periodCount);
  const originalLock = periodCount.multipliedBy(perPeriod);

  const futureLock = originalLock.minus(vestedOverPeriods);
  return futureLock;
};

// get lockedVestingAmount from function getLockedBalanceByAddressAndLockId
export const calculateClaimableAmount = (
  vestingSchedules: VestingSchedule[],
  lockedVestingAmount: BalanceLock | LockedTokens,
  currentBlockNumber: BigNumber
): BigNumber => {
  // calculate futureLock for every vesting schedule and sum to total
  const totalFutureLocks = vestingSchedules.reduce(function (
    total,
    vestingSchedule
  ) {
    const futureLock = calculateFutureLock(vestingSchedule, currentBlockNumber);
    return total.plus(futureLock);
  },
  new BigNumber(0));

  // calculate claimable amount
  const remainingVestingAmount = toBN(lockedVestingAmount?.amount?.toString());
  const claimableAmount = remainingVestingAmount.minus(totalFutureLocks);

  return claimableAmount;
};
