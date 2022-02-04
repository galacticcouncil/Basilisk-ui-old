import { ApiPromise } from '@polkadot/api';
import { SignedBlock } from '@polkadot/types/interfaces';
import { getValidationData, validationDataDataType } from './getValidationData';

const rawValidationData = 'mockedRawValidationData';
const mockJsonValidationData = 'result';
const parachainBlock = {
  block: { header: { hash: 'hash' } },
} as unknown as SignedBlock;

export const getMockApiPromise = (): ApiPromise =>
  ({
    query: {
      parachainSystem: {
        validationData: jest.fn(() => rawValidationData),
      },
    },
    derive: {
      chain: {
        subscribeNewBlocks: jest.fn(),
      },
    },
    createType: jest.fn(() => {
      return {
        isSome: true,
        toJSON: () => ({ mockJsonValidationData }),
      };
    }),
    at: jest.fn(() => getMockApiPromise()),
  } as unknown as ApiPromise);

describe('getValidationData', () => {
  let mockApiInstance: ApiPromise;

  beforeEach(() => {
    jest.resetAllMocks();
    mockApiInstance = getMockApiPromise();
  });

  it('gets validation data from parachain block head', async () => {
    const jsonValidationData = await getValidationData(
      mockApiInstance,
      parachainBlock
    );

    expect(jsonValidationData).toEqual({ mockJsonValidationData });
    expect(mockApiInstance.at).toHaveBeenCalled();
    expect(mockApiInstance.createType).toHaveBeenCalledWith(
      validationDataDataType,
      rawValidationData
    );
  });

  it.only(`doesn't get validation data from parachain block head`, async () => {
    // prepare
    (mockApiInstance.createType as jest.Mock).mockReturnValueOnce({
      isSome: false,
    });

    // test
    // variables should be descriptive, avoid using "u"
    // const u = await getValidationData(
    //   mockedUsePolkadotJsContext.apiInstance,
    //   signedBlock
    // );

    // assert
    // expect(mockedUsePolkadotJsContext.apiInstance.at).toHaveBeenCalled();
    // expect(u).toBeNull();
  });
});
