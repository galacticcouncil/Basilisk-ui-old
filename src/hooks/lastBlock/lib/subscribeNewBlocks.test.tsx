import { subscribeNewBlocks } from './subscribeNewBlocks';
import { ApiPromise } from '@polkadot/api';
import { handleNotifyNewBlock } from './handleNotifyNewBlock';
import waitForExpect from 'wait-for-expect';

jest.mock('./handleNotifyNewBlock');

const mockedCallback = jest.fn();
const mockedUnsubscribe = jest.fn();
const mockedSubscribeNewBlocks = jest.fn();
const mockedHandleNotifyNewBlock = handleNotifyNewBlock as unknown as jest.Mock<
  typeof handleNotifyNewBlock
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

describe.only('subscribeNewBlocks', () => {
  const mockedNotification = {};
  const mockedSubscriptionTimeout = 300;

  beforeEach(async () => {
    mockedHandleNotifyNewBlock.mockImplementationOnce(
      (_deps, callback) => callback
    );
    // run the subscription notification handler a.k.a. callback after some time
    mockedSubscribeNewBlocks.mockImplementationOnce(async (callback) => {
      setTimeout(() => callback(mockedNotification), mockedSubscriptionTimeout);
      return mockedUnsubscribe;
    });
  });

  afterEach(() => jest.useRealTimers());

  describe('results', () => {
    let result: any;

    beforeEach(async () => {
      result = await subscribeNewBlocks(mockedDependencies, mockedCallback);
    });

    it.only('should invoke the provided callback, once a new subscription notification arrives', async () => {
      await waitForExpect(() =>
        expect(mockedCallback).toHaveBeenCalledTimes(1)
      );
      await waitForExpect(() =>
        expect(mockedCallback).toHaveBeenCalledWith(mockedNotification)
      );
    });

    it.only('should return the underlying unsubscribe function', () => {
      expect(result).toBe(mockedUnsubscribe);
    });
  });

  describe('callback execution timing', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      subscribeNewBlocks(mockedDependencies, mockedCallback);
    });

    it('should not invoke the callback, before the subscription notification arrives', async () => {
      expect(mockedCallback).not.toBeCalled();
      // reset the timers back to normal, after checking that the callback was not executed yet
      jest.useRealTimers();
      await waitForExpect(() => expect(mockedCallback).toHaveBeenCalled());
    });
  });
});
