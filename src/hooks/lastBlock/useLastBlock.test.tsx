import TestRenderer, { act } from 'react-test-renderer';
import waitForExpect from 'wait-for-expect';
import { useLastBlock, __typename, id } from './useLastBlock';
import { subscribeNewBlock } from './lib/subscribeNewBlock';
import { getValidationData } from './lib/getValidationData';
import { setTimeout } from 'timers';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';
import { ApiPromise } from '@polkadot/api';
import { useEffect } from 'react';
import { LastBlock } from '../../generated/graphql';

const subscribeNewBlockMock = subscribeNewBlock as jest.Mock;
const getValidationDataMock = getValidationData as jest.Mock;

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

describe('useLastBlock', () => {
  let lastBlock: LastBlock | undefined = undefined;
  let lastBlockChanged = jest.fn();
  const Test = () => {
    const _lastBlock = useLastBlock();

    useEffect(() => {
      lastBlock = _lastBlock;
      if (lastBlock) {
        lastBlockChanged(lastBlock);
      }
    }, [_lastBlock]);

    return <></>;
  };
  const unsubscribe = jest.fn();

  let component: TestRenderer.ReactTestRenderer;
  const render = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    component = TestRenderer.create(<Test />);
  };

  beforeEach(() => {
    jest.resetModules();
    (usePolkadotJsContext as jest.Mock).mockReturnValue({
      apiInstance: getMockApiPromise(),
      loading: false,
    });
  });

  it('returns relay and parachain number', async () => {
    const expectedLastBlock = {
      __typename,
      id,
      relaychain: '10',
      parachain: '100',
    };

    getValidationDataMock.mockImplementation(async () => {
      return { relayParentNumber: expectedLastBlock.relaychain };
    });

    subscribeNewBlockMock.mockImplementation(async (_apiInstance, callback) => {
      callback({
        block: { header: { number: expectedLastBlock.parachain } },
      });

      return unsubscribe;
    });

    render();

    await act(async () => {
      await waitForExpect(() => {
        expect(lastBlock).toMatchObject(expectedLastBlock);
      });
    });

    act(() => component.update(<Test />));
    expect(unsubscribe).not.toBeCalled();
    act(() => component.unmount());
    expect(unsubscribe).toBeCalledTimes(1);
    expect(getValidationData).toBeCalledTimes(1);
    expect(getValidationData).toBeCalledWith(expect.any(Object), {
      block: { header: { number: expectedLastBlock.parachain } },
    });
    expect(lastBlockChanged).toBeCalledTimes(1);
  });

  it('returns relay and parachain number multiple times, once subscription returns new parachain number', async () => {
    const expectedPrevLastBlock = {
      __typename,
      id,
      relaychain: '10',
      parachain: '100',
    };
    const expectedLastBlock = {
      __typename,
      id,
      relaychain: '11',
      parachain: '101',
    };
    getValidationDataMock.mockImplementationOnce(async () => {
      return { relayParentNumber: expectedPrevLastBlock.relaychain };
    });
    getValidationDataMock.mockImplementationOnce(async () => {
      return { relayParentNumber: expectedLastBlock.relaychain };
    });
    subscribeNewBlockMock.mockImplementationOnce(
      async (_apiInstance, callback) => {
        callback({
          block: { header: { number: expectedPrevLastBlock.parachain } },
        });

        setTimeout(() => {
          callback({
            block: { header: { number: expectedLastBlock.parachain } },
          });
        }, 100);

        return unsubscribe;
      }
    );

    render();

    await act(async () => {
      await waitForExpect(() => {
        expect(lastBlock).toMatchObject(expectedPrevLastBlock);
      });

      await waitForExpect(() => {
        expect(lastBlock).toMatchObject(expectedLastBlock);
      });
    });
    expect(getValidationData).toBeCalledTimes(2);
    expect(getValidationData).toBeCalledWith(expect.any(Object), {
      block: { header: { number: expectedPrevLastBlock.parachain } },
    });
    expect(getValidationData).toBeCalledWith(expect.any(Object), {
      block: { header: { number: expectedLastBlock.parachain } },
    });
    expect(lastBlockChanged).toBeCalledTimes(2);
  });

  it('does not throw exception if polkadot hook empty apiInstance', async () => {
    (usePolkadotJsContext as jest.Mock).mockReturnValue({
      apiInstance: null,
      loading: false,
    });

    render();

    act(() => {
      component.update(<Test />);
      component.unmount();
    });

    expect(getValidationData).not.toBeCalled();
    expect(subscribeNewBlock).not.toBeCalled();
    expect(lastBlockChanged).not.toBeCalled();
  });

  it('unsubscribes as cleanup process if polkadot apiInstance changes', async () => {
    const expectedLastBlock = {
      __typename,
      id,
      relaychain: '10',
      parachain: '100',
    };
    getValidationDataMock.mockImplementation(async () => {
      return { relayParentNumber: expectedLastBlock.relaychain };
    });
    subscribeNewBlockMock.mockImplementation(async (_apiInstance, callback) => {
      callback({
        block: { header: { number: expectedLastBlock.parachain } },
      });

      return unsubscribe;
    });

    render();

    await act(async () => {
      await waitForExpect(() => {
        expect(lastBlock).toMatchObject(expectedLastBlock);
      });
    });
    act(() => {
      // update mocked apiInstance
      (usePolkadotJsContext as jest.Mock).mockReturnValue({
        apiInstance: getMockApiPromise(),
        loading: false,
      });
      component.update(<Test />);
    });

    await act(async () => {
      await waitForExpect(() => {
        expect(lastBlock).toMatchObject(expectedLastBlock);
      });
    });
    expect(unsubscribe).toBeCalledTimes(1);
    expect(lastBlockChanged).toBeCalledTimes(2);
  });
});
