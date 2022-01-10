import {
  RenderHookResult,
  Renderer,
  renderHook,
} from '@testing-library/react-hooks';
import { useConfigurePolkadotJs } from './usePolkadotJs';
import { ApiPromise } from '@polkadot/api';

type HookReturn = ApiPromise | undefined | any;
let renderHookResult: RenderHookResult<unknown, HookReturn, Renderer<unknown>>;
const timeout = 30000;

beforeEach(() => {
  renderHookResult = renderHook(() => useConfigurePolkadotJs());
});

// this test relies on a live node websocket to be configured in the default config
// TODO: mock the websocket for polkadotjs
test('configures a polkadot instance', async () => {
  const { result, waitForNextUpdate } = renderHookResult;
  await waitForNextUpdate({
    timeout,
  });
  expect(result.current.apiInstance instanceof ApiPromise).toBeTruthy();
});
