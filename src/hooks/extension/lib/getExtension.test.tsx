import { Extension } from '../../../generated/graphql';
import { getExtension } from './getExtension';

const extensionDappModule = '@polkadot/extension-dapp';

export const mockExtensionDappModule = ({
  isWeb3Injected,
}: {
  isWeb3Injected: boolean;
}) => {
  jest.doMock(extensionDappModule, () => ({
    isWeb3Injected,
  }));
};

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
      mockExtensionDappModule({
        isWeb3Injected: true,
      });

      extension = getExtension();
    });

    it('should set `isAvailable = true`', () => {
      expect(extension.isAvailable).toBe(true);
    });
  });
});
