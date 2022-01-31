import TestRenderer, { act } from 'react-test-renderer';
import waitForExpect from 'wait-for-expect';
import { useLastBlock } from './useLastBlock';
import { subscribeNewBlock } from './lib/subscribeNewBlock';
import { getValidationData } from './lib/getValidationData';

waitForExpect.defaults.interval = 1;

jest.mock('../polkadotJs/usePolkadotJs', () => ({
  usePolkadotJsContext: () => {
    // jest executes before imports, that's why require is here
    const {
      mockUsePolkadotJsContext,
    } = require('../polkadotJs/tests/mockUsePolkadotJsContext');
    return mockUsePolkadotJsContext();
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

  it('can resolve the query within the rendered component', async () => {
    const unsubscribe = jest.fn();
    (getValidationData as jest.Mock).mockImplementation(async () => {
      return { relayParentNumber: 10 };
    });

    (subscribeNewBlock as jest.Mock).mockImplementation(
      async (_apiInstance, callback) => {
        setTimeout(() => callback({ block: { header: { number: 100 } } }), 0);

        return unsubscribe;
      }
    );

    render();

    await act(async () => {
      await new Promise((res) => setTimeout(res, 1000));

      console.log(lastBlock);

      // await waitForExpect(() => {
      //     console.log(lastBlock)
      //     expect(1).toEqual(1);
      // });
    });
  });
});
