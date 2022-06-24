import { Asset } from '../Row/Row';
import { dummyData } from './DummyData';

export const useDisplayValueContext = (id?: string): string => {
  // TODO: Get from Graphql endpoint
  const assets: Asset[] = dummyData;
  const exchangeRate =
    id === undefined
      ? '1'
      : assets?.filter((asset) => asset.id === id)[0]?.exchangeRate ?? '0';

  return exchangeRate;
};
