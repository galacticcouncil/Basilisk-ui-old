import { Asset } from '../../generated/graphql';
import { flipSwap, orderSwapsInPath } from './buildPath';

describe('router/paths', () => {

  describe('flipSwap()', () => {
    it('can flip a swap', () => {
      const swapBeforeFlip = {
        id: 'address-1',
        assetIn: { id: '0' },
        assetOut: { id: '1' },
      };

      // clone without reference through spread operator
      const reversedSwap = flipSwap({ ...swapBeforeFlip });

      expect(reversedSwap.assetIn).toEqual(swapBeforeFlip.assetOut);
      expect(reversedSwap.assetOut).toEqual(swapBeforeFlip.assetIn);
      expect(reversedSwap.id).toEqual(swapBeforeFlip.id);
    });
  });

  describe('orderSwapsInPath()', () => {
    it('can', () => {
      const tokenIn: Asset = { id: '0' };
      const tokenOut: Asset = { id: '3' };
      const path = {
        id: 'address-1address-2address-3',
        swaps: [
          { id: 'address-1', assetIn: { id: '0' }, assetOut: { id: '1' } },
          { id: 'address-2', assetIn: { id: '2' }, assetOut: { id: '1' } },
          { id: 'address-3', assetIn: { id: '2' }, assetOut: { id: '3' } },
        ],
        pools: [],
      };

      const orderedPath = orderSwapsInPath(tokenIn, tokenOut, { ...path });
      expect(orderedPath.swaps[1].assetIn.id).toEqual('1');
      expect(orderedPath.swaps[1].assetOut.id).toEqual('2');
    });
  });
});
