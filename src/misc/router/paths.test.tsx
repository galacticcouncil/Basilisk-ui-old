import { Asset, Pool } from '../../generated/graphql';
import { computeAllPaths, filterPoolsOfInterest, flipSwap, orderSwapsInPath } from './paths';
import { Path } from './types';

describe('poolsFilter', () => {
  const pool1: Pool = {
    id: 'address-1',
    assetInId: '0',
    assetOutId: '1',
  };
  const pool2: Pool = {
    id: 'address-2',
    assetInId: '1',
    assetOutId: '2',
  };
  const pool3: Pool = {
    id: 'address-3',
    assetInId: '2',
    assetOutId: '3',
  };

  describe('filterPoolsOfInterest()', () => {
    const directPool: Pool = {
      id: 'address-3',
      assetInId: '0',
      assetOutId: '2',
    };

    // this case is not for multi-hop
    const tokenIn: Asset = { id: '0' };
    const tokenOut: Asset = { id: '2' };

    it('can find filter for direct pool', () => {
      const xykPools: Pool[] = [pool1, pool2, directPool];

      const tokenIn: Asset = { id: '0' };
      const tokenOut: Asset = { id: '2' };
      const reducedPools = filterPoolsOfInterest(
        xykPools,
        tokenIn,
        tokenOut,
        5
      );

      expect(reducedPools[0]).toEqual([directPool]);
    });

    it('can filter for relevant hopIn and hopOut pools', () => {
      const xykPools: Pool[] = [pool1, pool2];

      const [directPools, hopInPools, hopOutPools] = filterPoolsOfInterest(
        xykPools,
        tokenIn,
        tokenOut,
        5
      );

      expect(directPools).toStrictEqual([]);
      expect(hopInPools).toEqual([pool1]);
      expect(hopOutPools).toEqual([pool2]);
    });
  });

  describe('computeAllPaths()', () => {
    /**
     * want: 0->1
     * pools: 0/1
     * tokens: 0->1
     * number of pools: 1
     */
    it.only('can produce the path for the trivial case (no hop)', () => {
      const directPool = {
        id: 'address-0',
        assetInId: '0',
        assetOutId: '1',
      };
      const allPools = [directPool]; // pools base
      // TODO what happens if all pools is empty?
      const path = computeAllPaths(
        { id: '0' }, // from
        { id: '1' }, // to
        allPools,
        1 // maxHops
      );

      expect(path).toEqual([
        {
          id: 'address-0',
          swaps: [
            { id: 'address-0', assetIn: { id: '0' }, assetOut: { id: '1' } },
          ],
          pools: allPools,
        },
      ]);
    });

    /**
     * want: 0->2
     * pools: 0/1->1/2
     * number of pools: 2
     */
    it('can produce a one hop path', () => {
      const allPools = [pool1, pool2];

      const path = computeAllPaths({ id: '0' }, { id: '2' }, allPools, 2);

      expect(path).toEqual([
        {
          id: 'address-1address-2',
          swaps: [
            { id: 'address-1', assetIn: { id: '0' }, assetOut: { id: '1' } },
            { id: 'address-2', assetIn: { id: '1' }, assetOut: { id: '2' } },
          ],
          pools: allPools,
        },
      ]);
    });

    /**
     * want: 0->3
     * pools: 0/1->1/2->2/3
     * tokens: 0->1->2->3
     * number of pools: 3
     */
    it('can produce a multi-hop path', () => {
      const allPools = [pool1, pool2, pool3];
      const maxHops = 3;

      const path = computeAllPaths({ id: '0' }, { id: '3' }, allPools, maxHops);

      expect(path).toEqual([
        {
          id: 'address-1address-2address-3',
          swaps: [
            { id: 'address-1', assetIn: { id: '0' }, assetOut: { id: '1' } },
            { id: 'address-2', assetIn: { id: '1' }, assetOut: { id: '2' } },
            { id: 'address-3', assetIn: { id: '2' }, assetOut: { id: '3' } },
          ],
          pools: allPools,
        },
      ]);
    });

    it('can produce multiple paths', () => {
      const allPools = [
        {
          id: 'address-1',
          assetInId: '0',
          assetOutId: '1',
        },
        {
          id: 'address-2',
          assetInId: '0',
          assetOutId: '2',
        },
        {
          id: 'address-3',
          assetInId: '2',
          assetOutId: '3',
        },
        {
          id: 'address-4',
          assetInId: '1',
          assetOutId: '3',
        },
        {
          id: 'address-5',
          assetInId: '1',
          assetOutId: '2',
        },
      ];
      const maxHops = 3;

      const paths = computeAllPaths(
        { id: '0' },
        { id: '3' },
        allPools,
        maxHops
      );

      const expectedPaths = [
        { id: 'address-1address-5address-3' },
        { id: 'address-1address-4' },
        { id: 'address-2address-3' },
        { id: 'address-2address-5address-4' },
      ];
      expect(expectedPaths.map((path) => path.id).sort()).toEqual(
        paths.map((path: Path) => path.id).sort()
      );
    });
  });

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
