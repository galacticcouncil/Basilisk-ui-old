import { useCallback } from 'react'
import { Account } from '../../generated/graphql'
import { withErrorHandler } from '../apollo/withErrorHandler'
import { useGetVestingScheduleByAddress } from './useGetVestingScheduleByAddress'

export const useVestingScheduleQueryResolvers = () => {
  const getVestingScheduleByAddress = useGetVestingScheduleByAddress()
  const vestingSchedule = withErrorHandler(
    useCallback(
      async (account: Account) => await getVestingScheduleByAddress(),
      [getVestingScheduleByAddress]
    ),
    'vestingSchedule'
  )

  return {
    vestingSchedule
  }
}
