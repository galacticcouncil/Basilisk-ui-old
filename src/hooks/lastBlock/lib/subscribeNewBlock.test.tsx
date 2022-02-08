import { ApiPromise } from '@polkadot/api';
import { subscribeNewBlock } from './subscribeNewBlock';

export const getMockApiPromise = (): ApiPromise =>
  ({
    derive: {
      chain: {
        subscribeNewBlocks: jest.fn(),
      },
    },
  } as unknown as ApiPromise);

describe('subscribeNewBlock', () => {
  let mockApiInstance: ApiPromise;

  beforeEach(() => {
    jest.resetAllMocks();
    mockApiInstance = getMockApiPromise();
  });

  it('subscribes with a callback', async () => {
    const callback = jest.fn();
    const unsubscribe = jest.fn();

    (
      mockApiInstance.derive.chain.subscribeNewBlocks as jest.Mock
    ).mockResolvedValue(unsubscribe);

    const returnedUnsubscribe = await subscribeNewBlock(
      mockApiInstance,
      callback
    );

    expect(returnedUnsubscribe).toEqual(unsubscribe);
    expect(
      mockApiInstance.derive.chain.subscribeNewBlocks
    ).toHaveBeenCalledWith(callback);
  });
});
