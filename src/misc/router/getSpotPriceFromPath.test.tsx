import { HydraDxMath, HydraDxMathLbp } from '../../hooks/math/useMath';
import { getSpotPriceFromPath } from './getSpotPriceFromPath';
import xyk from 'hydra-dx-wasm/build/xyk/nodejs';
import testData from './getSpotPriceFromPath.json';

describe('getSpotPriceFromPath', () => {
  let math: HydraDxMath;

  beforeAll(async () => {
    math = { xyk, lbp: undefined as unknown as HydraDxMathLbp };
  });

  /**
   * spotPrice1 = reserve1 / reserve0 = 5 asset0/asset1
   * spotPrice2 = reserve2/ reserve1 = 0.15 asset1/asset2
   * spotPrice1_2 = asset0/asset1 * asset1/asset2 = 5*0.15 = 75
   */
  it('can calculate spot price for given path with 2 swaps', () => {
    const path = testData[0].path;
    const spotPrice = getSpotPriceFromPath(path, math);

    expect(spotPrice).toEqual(testData[0].spotPrice);
  });

  it('can calculate spot price for given path with 3 swaps', () => {
    const path = testData[1].path;
    const spotPrice = getSpotPriceFromPath(path, math);

    expect(spotPrice).toEqual(testData[1].spotPrice);
  });
});
