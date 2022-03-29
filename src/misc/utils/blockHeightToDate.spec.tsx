import blockHeightToDate, { blockTimeKusama } from './blockHeightToDate';

describe('TradeGraph', () => {
  describe('blockHeightToDate', () => {
    it('should convert a block height to a date object', () => {
      const timestamp = 1574962074000;
      const blockHeight = 1;
      // 2019-11-28T17:27:48.000Z + 1 block
      const date = blockHeightToDate(blockHeight, blockTimeKusama);
      expect(date.getTime()).toBe(timestamp);
    });
  });
});

export {};
