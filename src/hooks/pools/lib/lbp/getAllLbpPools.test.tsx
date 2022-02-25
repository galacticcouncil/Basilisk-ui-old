import { ApiPromise, WsProvider } from '@polkadot/api';
import { getAllLbpPools } from './getAllLbpPools';

describe('getAllLbpPools', () => {
  it.only('test', async () => {
    const wsProvider = new WsProvider('ws://127.0.0.1:9988');
    const apiInstance = await new ApiPromise({ provider: wsProvider }).isReady;
    //console.log(await apiInstance.query.lbp.poolData.entries())
    await getAllLbpPools(apiInstance);
    //console.log(await apiInstance.query.xyk.totalLiquidity.entries())
  });
});
