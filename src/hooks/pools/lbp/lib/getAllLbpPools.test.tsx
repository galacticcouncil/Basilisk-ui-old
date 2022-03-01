import { ApiPromise } from '@polkadot/api';
import { getAllLbpPools } from './getAllLbpPools';

const mockedPalletLbpPool = jest.fn();
const getMockApiPromise = () =>
  ({
    query: {
      lbp: {
        poolData: { entries: mockedPalletLbpPool },
      },
    },
  } as unknown as ApiPromise);

const address = 'bXiWm9TE6YXY9mpPeFK8NwjEgMdfmmBdstx33YskqLYvK6dZx';
const mockedLbpPallet = jest.fn();
const mockedOptionLbpPallet = [
  [
    { args: address },
    {
      isNone: false,
      unwrap: mockedLbpPallet,
    },
  ],
];
const mockedLbpPalletValue = {
  owner: 'bXmPf7DcVmFuHEmzH3UX8t6AUkfNQW8pnTeXGhFhqbfngjAak',
  start: '233',
  end: '423',
  assets: ['2', '0'],
  initialWeight: '10000000',
  finalWeight: '90000000',
  weightCurve: 'Linear',
  fee: ['1', '10'],
  feeCollector: 'bXmoSgp2Vtvctj5c292YDYu1vcYC4A5Hs1gdMjRhfXUf7Ht6x',
  repayTarget: '10000000',
};

describe('getAllLbpPools', () => {
  let apiInstance: ApiPromise;

  beforeEach(() => {
    apiInstance = getMockApiPromise();
  });

  describe(`lbpPallet isNone and can't unwrap`, () => {
    beforeEach(() => {
      mockedPalletLbpPool.mockReturnValueOnce([['address', { isNone: true }]]);
    });

    it('returns an empty array', async () => {
      const lbpPools = await getAllLbpPools(apiInstance);

      expect(lbpPools).toEqual([]);
    });
  });

  describe('lbpPallet isSome and can unwrap', () => {
    beforeEach(() => {
      mockedPalletLbpPool.mockReturnValueOnce(mockedOptionLbpPallet);
      mockedLbpPallet.mockReturnValueOnce(mockedLbpPalletValue);
    });

    it('can return an LBP pool', async () => {
      const lbpPools = await getAllLbpPools(apiInstance);

      expect(lbpPools).toEqual([
        {
          assetAWeights: {
            initial: mockedLbpPalletValue.initialWeight,
            final: mockedLbpPalletValue.finalWeight,
            current: mockedLbpPalletValue.initialWeight,
          },
          assetBWeights: {
            initial: mockedLbpPalletValue.finalWeight,
            final: mockedLbpPalletValue.initialWeight,
            current: mockedLbpPalletValue.finalWeight,
          },
          assetInId: mockedLbpPalletValue.assets[0],
          assetOutId: mockedLbpPalletValue.assets[1],
          startBlock: mockedLbpPalletValue.start,
          endBlock: mockedLbpPalletValue.end,
          fee: {
            numerator: mockedLbpPalletValue.fee[0],
            denominator: mockedLbpPalletValue.fee[1],
          },
          repayTargetReached: false,
          id: address,
        },
      ]);
    });
  });
});
