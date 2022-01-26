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

  beforeEach(async () => {
    jest.resetAllMocks();
    extension = await getExtension();
  });

  describe('extension unavailable', () => {
    it('should set `isAvailable = true`', () => {
      expect(extension.isAvailable).toBe(false);
    });
  });

  describe('extension availale', () => {
    beforeEach(async () => {
      mockExtensionDappModule({
        isWeb3Injected: true,
      });

      extension = await getExtension();
    });

    it('should set `isAvailable = true`', () => {
      expect(extension.isAvailable).toBe(true);
    });
  });
});
