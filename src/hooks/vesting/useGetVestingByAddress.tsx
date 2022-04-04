import { useMemo } from 'react';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';
import { Vec } from '@polkadot/types';
import { VestingScheduleOf } from '@open-web3/orml-types/interfaces';
import { ApiPromise } from '@polkadot/api';
import {
  calculateTotalLocks,
  getLockedBalanceByAddressAndLockId,
  vestingBalanceLockId,
} from './calculateClaimableAmount';
import { readLastBlock } from '../lastBlock/readLastBlock';
import { ApolloClient } from '@apollo/client';
import BigNumber from 'bignumber.js';
import { fromPrecision12 } from '../math/useFromPrecision';

export const vestingScheduleDataType = 'Vec<VestingScheduleOf>';

// TODO: use type from graphql in VestingSchedule.graphql
// without remainingVestingAmount property - currently yarn run codegen is broken
export type VestingSchedule = {
  start: string | undefined;
  period: string | undefined;
  periodCount: string | undefined;
  perPeriod: string | undefined;
};

export const getVestingByAddressFactory =
  (apiInstance?: ApiPromise) =>
  async (client: ApolloClient<object>, address?: string) => {
    if (!apiInstance || !address) return;

    const currentBlockNumber =
      readLastBlock(client)?.lastBlock?.relaychainBlockNumber;
    if (!currentBlockNumber)
      throw Error(`Can't calculate locks without current block number.`);

    // TODO: instead of multiple .createType calls, use the following
    // https://github.com/AcalaNetwork/acala.js/blob/9634e2291f1723a84980b3087c55573763c8e82e/packages/sdk-core/src/functions/getSubscribeOrAtQuery.ts#L4
    const vestingSchedulesData = apiInstance.createType(
      vestingScheduleDataType,
      await apiInstance.query.vesting.vestingSchedules(address)
    ) as Vec<VestingScheduleOf>;

    const vestingSchedules = vestingSchedulesData.map((vestingSchedule) => {
      // remap to object with string properties
      return {
        start: vestingSchedule?.start.toString(),
        period: vestingSchedule?.period.toString(),
        periodCount: vestingSchedule?.periodCount.toString(),
        perPeriod: vestingSchedule?.perPeriod.toString(),
      } as VestingSchedule;
    });

    const totalLocks = calculateTotalLocks(
      vestingSchedules,
      currentBlockNumber!
    );

    const lockedVestingBalance = (
      await getLockedBalanceByAddressAndLockId(
        apiInstance,
        address,
        vestingBalanceLockId
      )
    )?.amount?.toString();

    if (!lockedVestingBalance)
      throw Error(`Can't fetch remaining vesting balance`);

    const totalRemainingVesting = new BigNumber(lockedVestingBalance!);
    // claimable = remainingVesting - all future locks
    const claimableAmount = totalRemainingVesting.minus(
      new BigNumber(totalLocks.future)
    );

    return {
      claimableAmount: fromPrecision12(claimableAmount.toString()),
      originalLockBalance: fromPrecision12(totalLocks.original),
      lockedVestingBalance: fromPrecision12(totalRemainingVesting.toString()),
    };
  };

export const useGetVestingByAddress = () => {
  const { apiInstance } = usePolkadotJsContext();

  const getVestingByAddress = useMemo(
    () => getVestingByAddressFactory(apiInstance),
    [apiInstance]
  );

  return getVestingByAddress;
};
