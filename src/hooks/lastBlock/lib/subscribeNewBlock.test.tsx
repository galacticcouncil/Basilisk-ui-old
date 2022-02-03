import { mockUsePolkadotJsContext } from '../../polkadotJs/tests/mockUsePolkadotJsContext';
import { subscribeNewBlock } from './subscribeNewBlock';

const mockedUsePolkadotJsContext = mockUsePolkadotJsContext();

describe('hooks/lastBlock/lib/subscribeNewBlock', () => {
  it('subscribes with a callback', async () => {
    expect.assertions(2);
    const callback = jest.fn();
    const unsubscribe = jest.fn();

    (
      mockedUsePolkadotJsContext.apiInstance.derive.chain
        .subscribeNewBlocks as jest.Mock
    ).mockImplementationOnce((cb) => {
      expect(cb).toEqual(callback);

      return unsubscribe;
    });

    const u = await subscribeNewBlock(
      mockedUsePolkadotJsContext.apiInstance,
      callback
    );

    expect(u).toEqual(unsubscribe);
  });
});
