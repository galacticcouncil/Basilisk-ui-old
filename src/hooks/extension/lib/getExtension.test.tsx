import { Extension } from '../../../generated/graphql';
import { getExtension } from './getExtension';

const extensionDappModule = '@polkadot/extension-dapp';

describe('getExtension', () => {
  let extension: Extension;

  beforeEach(() => {
    jest.resetAllMocks();
    extension = getExtension();
  });

  describe('extension unavailable', () => {
    it('should set `isAvailable = true`', () => {
      expect(extension.isAvailable).toBe(false);
    });
  });

  describe('extension availale', () => {
    beforeEach(() => {
      jest.doMock(extensionDappModule, () => ({
        isWeb3Injected: true,
      }));

      extension = getExtension();
    });

    it('should set `isAvailable = true`', () => {
      expect(extension.isAvailable).toBe(true);
    });
  });
});
