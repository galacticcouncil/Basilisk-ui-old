import { useCallback } from 'react'
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'
import { Vec } from '@polkadot/types'
import { VestingScheduleOf } from '@open-web3/orml-types/interfaces'
import { ApiPromise } from '@polkadot/api'

export const vestingScheduleDataType = 'Vec<VestingScheduleOf>'

// TODO: use type from graphql in VestingSchedule.graphql
// without remainingVestingAmount property - currently yarn run codegen is broken
export type VestingSchedule = {
  start: string | undefined
  period: string | undefined
  periodCount: string | undefined
  perPeriod: string | undefined
}

export const getVestingSchedulesByAddressFactory =
  (apiInstance?: ApiPromise) => async (address?: string) => {
    if (!apiInstance || !address) return

    // TODO: instead of multiple .createType calls, use the following
    // https://github.com/AcalaNetwork/acala.js/blob/9634e2291f1723a84980b3087c55573763c8e82e/packages/sdk-core/src/functions/getSubscribeOrAtQuery.ts#L4
    const vestingSchedules = apiInstance.createType(
      vestingScheduleDataType,
      await apiInstance.query.vesting.vestingSchedules(address)
    ) as Vec<VestingScheduleOf>

    return vestingSchedules.map((vestingSchedule) => {
      // remap to object with string properties
      return {
        start: vestingSchedule?.start.toString(),
        period: vestingSchedule?.period.toString(),
        periodCount: vestingSchedule?.periodCount.toString(),
        perPeriod: vestingSchedule?.perPeriod.toString()
      } as VestingSchedule
    })
  }

// TODO: change to plural "Schedules"
export const useGetVestingScheduleByAddress = () => {
  const { apiInstance } = usePolkadotJsContext()

  const getVestingScheduleByAddress = useCallback(
    () => getVestingSchedulesByAddressFactory(apiInstance),
    [apiInstance]
  )

  return getVestingScheduleByAddress
}
