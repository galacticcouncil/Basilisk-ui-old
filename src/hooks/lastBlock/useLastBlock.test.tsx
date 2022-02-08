import TestRenderer, { act } from 'react-test-renderer';
import waitForExpect from 'wait-for-expect';
import { useLastBlock, __typename, id } from './useLastBlock';
import { subscribeNewBlock } from './lib/subscribeNewBlock';
import { getValidationData } from './lib/getValidationData';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';
import { ApiPromise } from '@polkadot/api';
import { useEffect } from 'react';
import { LastBlock } from '../../generated/graphql';
import { times } from 'lodash';

const subscribeNewBlockMock = subscribeNewBlock as jest.Mock;
const getValidationDataMock = getValidationData as jest.Mock;
const usePolkadotJsContextMock = usePolkadotJsContext as jest.Mock;

export const getMockApiPromise = (): ApiPromise =>
  ({} as unknown as ApiPromise);

jest.mock('../polkadotJs/usePolkadotJs', () => ({
  usePolkadotJsContext: jest.fn(),
}));

jest.mock('./lib/subscribeNewBlock', () => {
  return { subscribeNewBlock: jest.fn() };
});

jest.mock('./lib/getValidationData', () => {
  return {
    getValidationData: jest.fn(),
  };
});

const mockLastBlock = {
  __typename,
  id,
  relaychain: '10',
  parachain: '100',
};

describe('useLastBlock', () => {
  let lastBlock: LastBlock | undefined;
  let lastBlockChanged = jest.fn();
  const unsubscribe = jest.fn();

  const Test = () => {
    const _lastBlock = useLastBlock();

    useEffect(() => {
      lastBlock = _lastBlock;
      lastBlockChanged(lastBlock);
    }, [_lastBlock]);

    return <></>;
  };

  let component: TestRenderer.ReactTestRenderer;
  const render = () => {
    component = TestRenderer.create(<Test />);
  };

  const update = () => act(() => component.update(<Test />));

  beforeEach(() => {
    jest.resetModules();
    usePolkadotJsContextMock.mockReturnValue({
      apiInstance: getMockApiPromise(),
      loading: false,
    });

    getValidationDataMock.mockImplementation(async () => {
      return { relayParentNumber: mockLastBlock.relaychain };
    });
  });

  describe('cases with no subscription triggers', () => {
    it('does not fail, if the apiInstance is not present', async () => {
      usePolkadotJsContextMock.mockReturnValue({
        apiInstance: null,
        loading: false,
      });

      render();

      act(() => {
        component.update(<Test />);
      });

      expect(getValidationData).not.toBeCalled();
      expect(subscribeNewBlock).not.toBeCalled();
      expect(unsubscribe).not.toBeCalled();
      // just on the initial render
      expect(lastBlockChanged).toBeCalledTimes(1);
    });

    it('unsubscribes as cleanup process if polkadot apiInstance changes', async () => {
      subscribeNewBlockMock.mockImplementation(async (_apiInstance) => {
        return unsubscribe;
      });

      render();

      // we do this asynchronously, since waiting for
      // the new 'unsubscribe' function is asynchronous
      await act(async () => {
        // update mocked apiInstance
        usePolkadotJsContextMock.mockReturnValue({
          apiInstance: getMockApiPromise(),
          loading: false,
        });
        component.update(<Test />);
      });

      expect(unsubscribe).toBeCalledTimes(1);
    });
  });

  describe('cases with single subscription return', () => {
    beforeEach(async () => {
      subscribeNewBlockMock.mockImplementation(
        async (_apiInstance, callback) => {
          callback({
            block: { header: { number: mockLastBlock.parachain } },
          });

          return unsubscribe;
        }
      );

      // eslint-disable-next-line testing-library/no-render-in-setup
      render();
      // finish running effects before proceeding
      // wait for the first block update
      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {});
    });

    it('returns relay and parachain number', async () => {
      // once the subscription is triggered, update the `lastBlock` with the mocked data
      expect(lastBlock).toMatchObject(mockLastBlock);

      // ensure that when the subscription is triggered, we only fetch the data once
      expect(getValidationData).toBeCalledTimes(1);
      expect(getValidationData).toBeCalledWith(expect.any(Object), {
        block: { header: { number: mockLastBlock.parachain } },
      });
      // effect is triggered twice, once with no data, and then once the mock callback is triggered
      expect(lastBlockChanged).toBeCalledTimes(2);
    });

    describe('subscribeNewBlock', () => {
      it('only subscribe once, at the first render', async () => {
        // update 3 times, for the lolz
        times(3).forEach(update);
        expect(subscribeNewBlockMock).toBeCalledTimes(1);
      });
    });

    describe('unsubscribe', () => {
      it('does not unsubscribe on re-render', () => {
        act(() => component.update(<Test />));
        expect(unsubscribe).not.toBeCalled();
      });

      it('does unsubscribe when the component unmounts', () => {
        act(() => component.unmount());
        expect(unsubscribe).toBeCalledTimes(1);
      });
    });
  });

  describe('cases with multiple subscription returns', () => {
    const expectedPrevLastBlock = mockLastBlock;
    const expectedLastBlock = {
      ...expectedPrevLastBlock,
      relaychain: '11',
      parachain: '101',
    };

    let callback: (block: any) => Promise<void> = async () => {};

    beforeEach(async () => {
      getValidationDataMock.mockImplementationOnce(async () => {
        return { relayParentNumber: expectedPrevLastBlock.relaychain };
      });
      getValidationDataMock.mockImplementationOnce(async () => {
        return { relayParentNumber: expectedLastBlock.relaychain };
      });
      subscribeNewBlockMock.mockImplementationOnce(
        async (_apiInstance, _callback) => {
          // store the callback, so that we can change the component state within the test
          callback = _callback;
          callback({
            block: { header: { number: expectedPrevLastBlock.parachain } },
          });

          return unsubscribe;
        }
      );

      // eslint-disable-next-line testing-library/no-render-in-setup
      render();
      // wait for the first block update
      // eslint-disable-next-line testing-library/no-unnecessary-act
      await act(async () => {});
    });

    it('returns relay and parachain number twice, once subscription returns new parachain number', async () => {
      expect(lastBlock).toMatchObject(expectedPrevLastBlock);
      expect(getValidationData).toBeCalledTimes(1);
      expect(getValidationData).toBeCalledWith(expect.any(Object), {
        block: { header: { number: expectedPrevLastBlock.parachain } },
      });
      // one initial render + one real update
      expect(lastBlockChanged).toBeCalledTimes(2);

      // run the second update via the subscription
      await act(async () => {
        await callback({
          block: { header: { number: expectedLastBlock.parachain } },
        });
      });

      // we need to wait for the additional subscription callback to be fired after a timeout
      await waitForExpect(() => {
        expect(lastBlock).toMatchObject(expectedLastBlock);
      });
      expect(getValidationData).toBeCalledTimes(2);
      expect(getValidationData).toBeCalledWith(expect.any(Object), {
        block: { header: { number: expectedLastBlock.parachain } },
      });

      // one initial render + two real updates
      expect(lastBlockChanged).toBeCalledTimes(3);
    });
  });
});
