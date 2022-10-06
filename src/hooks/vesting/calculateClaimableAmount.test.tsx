import BigNumber from 'bignumber.js'
import { calculateLock } from './calculateClaimableAmount'

describe('calculateClaimableAmount', () => {
  describe('calculateLock', () => {
    const vestingSchedule = {
      start: '10',
      period: '10',
      periodCount: '30',
      perPeriod: '100'
    }
    const currentBlock = '30'
    const expectedOriginalLock = new BigNumber(3000)
    const expectedFutureLock = new BigNumber(2800)

    it('can calculate original- and future-lock for one vesting schedule', () => {
      const [originalLock, futureLock] = calculateLock(
        vestingSchedule,
        currentBlock
      )

      expect(originalLock).toEqual(expectedOriginalLock)
      expect(futureLock).toEqual(expectedFutureLock)
    })
  })
})
