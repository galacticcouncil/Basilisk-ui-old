import BigNumber from 'bignumber.js';
import constants from '../../constants';
import {
  calculateClaimableAmount,
  calculateFutureLock,
  toBN,
} from './calculateClaimableAmount';

describe('calculateClaimableAmount', () => {
  const vestingSchedule = {
    start: '10',
    period: '10',
    periodCount: '30',
    perPeriod: '100',
  };
  const currentBlock = new BigNumber(30);
  const lockedTokens = { id: 'ormlvest', amount: '10000' };

  describe('toBN', () => {
    it('returns default value for undefined', () => {
      const value = toBN(undefined);
      expect(value).toEqual(new BigNumber(constants.defaultValue));
    });
  });

  describe('calculateFutureLock', () => {
    it('can calculate future lock for one vesting schedule', () => {
      const futureLock = calculateFutureLock(vestingSchedule, currentBlock);

      expect(futureLock).toEqual(new BigNumber(2800));
    });
  });

  describe('calculateClaimableAmount', () => {
    it('can calculate claimable amount', () => {
      const claimableAmount = calculateClaimableAmount(
        [vestingSchedule, vestingSchedule],
        lockedTokens,
        currentBlock
      );

      expect(claimableAmount).toEqual(
        toBN(lockedTokens.amount).minus(toBN('2800').multipliedBy(2))
      );
    });
  });
});
