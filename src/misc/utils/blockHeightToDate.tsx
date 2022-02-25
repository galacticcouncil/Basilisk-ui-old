import BigNumber from 'bignumber.js';

export const blockTimeKusama = 6000; // 6s
export const genesisKusama = new Date('2019-11-28 17:27:48 UTC');

/**
 * Estimate the date at a given block height
 *
 * TODO: instead of estimating the block date, fetch the real block timestamp
 * @param blockHeight
 */
const blockHeightToDate = (
  blockHeight: number,
  blockTime: number = blockTimeKusama
) => {
  const milisecondsSinceGenesis = new BigNumber(blockHeight)
    .multipliedBy(blockTime)
    .toNumber();

  const milisecondsSinceEpoch =
    genesisKusama.getTime() + milisecondsSinceGenesis;
  const blockDate = new Date(milisecondsSinceEpoch);

  return blockDate;
};
export default blockHeightToDate;
