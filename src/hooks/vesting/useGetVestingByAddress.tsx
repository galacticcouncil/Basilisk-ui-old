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
import { Query, Vesting, VestingSchedule } from '../../generated/graphql';

export const vestingScheduleDataType = 'Vec<VestingScheduleOf>';

export const getVestingByAddressFactory =
  (apiInstance?: ApiPromise) =>
  async (
    client: ApolloClient<object>,
    address?: string
  ): Promise<Query['vesting']> => {
    if (!apiInstance || !address) return;
    const currentBlockNumber =
      readLastBlock(client)?.lastBlock?.parachainBlockNumber;
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
    console.log('totalLocks', totalLocks)

    const lockedVestingBalance = (
      await getLockedBalanceByAddressAndLockId(
        apiInstance,
        address,
        vestingBalanceLockId
      )
    )?.amount?.toString();

    if (!lockedVestingBalance) return {
      claimableAmount: '0',
      originalLockBalance: '0',
      lockedVestingBalance: '0',
    }

    // TODO: add support for lockIds other than ormlvest 
    const originalOrmlvestVesting = new BigNumber(lockedVestingBalance!);
    // claimable = remainingVesting - all future locks
    const claimableAmount = originalOrmlvestVesting.minus(
      new BigNumber(totalLocks.future)
    );

    return {
      claimableAmount: claimableAmount.toString(),
      originalLockBalance: totalLocks.original, // totalLocks.original == originalOrmlvestVesting
      lockedVestingBalance: totalLocks.future.toString(),
    } as Vesting;
  };

export const useGetVestingByAddress = () => {
  const { apiInstance } = usePolkadotJsContext();

  const getVestingByAddress = useMemo(
    () => getVestingByAddressFactory(apiInstance),
    [apiInstance]
  );

  return getVestingByAddress;
};
