import TestRenderer, { act } from 'react-test-renderer';
import waitForExpect from 'wait-for-expect';
import { useLastBlock, __typename, id } from './useLastBlock';
import { subscribeNewBlock } from './lib/subscribeNewBlock';
import { getValidationData } from './lib/getValidationData';
import { setTimeout } from 'timers';
waitForExpect.defaults.interval = 10;
waitForExpect.defaults.timeout = 1000;

jest.mock('../polkadotJs/usePolkadotJs', () => ({
  usePolkadotJsContext: () => {
    // jest executes before imports, that's why require is here
    const {
      mockUsePolkadotJsContext,
    } = require('../polkadotJs/tests/mockUsePolkadotJsContext');

    return mockUsePolkadotJsContext;
  },
}));

jest.mock('./lib/subscribeNewBlock', () => {
  return { subscribeNewBlock: jest.fn() };
});

jest.mock('./lib/getValidationData', () => {
  return {
    getValidationData: jest.fn(),
  };
});

describe('hooks/lastBlock/useLastBlock', () => {
  let lastBlock: any = {};
  const Test = () => {
    lastBlock = useLastBlock();

    return <></>;
  };

  let component: TestRenderer.ReactTestRenderer;
  const render = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    component = TestRenderer.create(<Test />);
  };

  beforeEach(() => {
    jest.resetModules();
  });

  it('returns relay and parachain number', async () => {
    const expectedLastBlock = {
      __typename,
      id,
      relaychain: '10',
      parachain: '100',
    };

    const unsubscribe = jest.fn();
    (getValidationData as jest.Mock).mockImplementation(async () => {
      return { relayParentNumber: expectedLastBlock.relaychain };
    });

    (subscribeNewBlock as jest.Mock).mockImplementation(
      async (_apiInstance, callback) => {
        callback({
          block: { header: { number: expectedLastBlock.parachain } },
        });

        return unsubscribe;
      }
    );

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

    const unsubscribe = jest.fn();
    (getValidationData as jest.Mock).mockImplementationOnce(async () => {
      return { relayParentNumber: expectedPrevLastBlock.relaychain };
    });
    (getValidationData as jest.Mock).mockImplementationOnce(async () => {
      return { relayParentNumber: expectedLastBlock.relaychain };
    });

    (subscribeNewBlock as jest.Mock).mockImplementationOnce(
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
  });
});
