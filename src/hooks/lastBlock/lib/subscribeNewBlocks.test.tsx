import { makeSubscribeNewBlocks } from './subscribeNewBlocks';
import { ApiPromise } from '@polkadot/api';
import { makeHandleNotifyNewBlock } from './handleNotifyNewBlock';
import waitForExpect from 'wait-for-expect';

jest.mock('./handleNotifyNewBlock');

const mockedCallback = jest.fn();
const mockedUnsubscribe = jest.fn();
const mockedSubscribeNewBlocks = jest.fn();
const mockedSubscribeNewBlocksImplementation = jest.fn();
const mockedMakeHandleNotifyNewBlock =
  makeHandleNotifyNewBlock as unknown as jest.Mock<
    typeof makeHandleNotifyNewBlock
  >;
const mockedHandleNotifyNewBlock = jest.fn() as jest.Mock<
  ReturnType<typeof makeHandleNotifyNewBlock>
>;

const mockedDependencies = {
  apiInstance: {
    derive: {
      chain: {
        subscribeNewBlocks: mockedSubscribeNewBlocks,
      },
    },
  } as unknown as ApiPromise,
};

describe('subscribeNewBlocks', () => {
  const mockedNotification = {};
  const mockedSubscriptionTimeout = 300;

  beforeEach(async () => {
    mockedMakeHandleNotifyNewBlock.mockReturnValueOnce(
      mockedHandleNotifyNewBlock
    );
    // return the callback it is called with
    mockedHandleNotifyNewBlock.mockImplementationOnce((callback) => callback);
    // run the subscription notification handler a.k.a. callback after some time
    mockedSubscribeNewBlocks.mockImplementationOnce(
      mockedSubscribeNewBlocksImplementation
    );
    mockedSubscribeNewBlocksImplementation.mockImplementationOnce(
      async (callback) => {
        setTimeout(
          () => callback(mockedNotification),
          mockedSubscriptionTimeout
        );
        return mockedUnsubscribe;
      }
    );
  });

  afterEach(() => jest.useRealTimers());

  describe('results', () => {
    let result: any;

    beforeEach(async () => {
      result = await makeSubscribeNewBlocks(mockedDependencies)(mockedCallback);
    });

    it('should invoke the provided callback, once a new subscription notification arrives', async () => {
      await waitForExpect(() =>
        expect(mockedCallback).toHaveBeenCalledTimes(1)
      );
      await waitForExpect(() =>
        expect(mockedCallback).toHaveBeenCalledWith(mockedNotification)
      );
    });

    it('should return the underlying unsubscribe function', () => {
      expect(result).toBe(mockedUnsubscribe);
    });
  });

  describe('callback execution timing', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      makeSubscribeNewBlocks(mockedDependencies)(mockedCallback);
    });

    it('should not invoke the callback, before the subscription notification arrives', async () => {
      expect(mockedCallback).not.toBeCalled();
      // reset the timers back to normal, after checking that the callback was not executed yet
      jest.useRealTimers();
      await waitForExpect(() => expect(mockedCallback).toHaveBeenCalled());
    });
  });
});
