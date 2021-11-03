import { VestingSchedule } from '../../generated/graphql';

export const useClaimableAmount = (
    // { 
    //     remainingVestingBalance,
    //     start,
    //     period,
    //     periodCount,
    //     perPeriod
    // }: VestingSchedule,
    lastRelayChainBlock: string
) => {
    // const now = 20;
    // const start = 10;
    // const period = 10;
    // const periodCount = 30;
    // const perPeriod = 100;

    // if (now < start) return 0;

    // // currentLock sum of all vesting schedules!!!!
    // // TODO: make sure to account for all vesting schedules in futureLock
    // const currentLock = remainingVestingBalance; // 2900

    // {
    // const numOfPeriods = (now - start) / period; // 2
    // const vestedOverPeriods = numOfPeriods * perPeriod; // 200
    
    // const originalLock = periodCount * perPeriod; // 3000
    // const futureLock = originalLock - vestedOverPeriods; // 2800
    // }

    // // 2900 - 2800 = 100
    // const claimable = currentLock - futureLockSum;
}