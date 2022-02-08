import { ApiPromise } from '@polkadot/api';
import { SignedBlock } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import { getValidationData, validationDataDataType } from './getValidationData';

const mockRawValidationData = 'mockedRawValidationData';
const mockUnwrappedValidationData = 'result';
const mockParachainBlock = {
  block: { header: { hash: 'hash' } },
} as unknown as SignedBlock;

export const getMockApiPromise = (): jest.Mocked<ApiPromise> =>
  ({
    query: {
      parachainSystem: {
        validationData: jest.fn(() => mockRawValidationData),
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
        unwrap: () => mockUnwrappedValidationData,
      };
    }),
    at: jest.fn(() => getMockApiPromise()),
  } as unknown as jest.Mocked<ApiPromise>);

describe('getValidationData', () => {
  let mockApiInstance: jest.Mocked<ApiPromise>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockApiInstance = getMockApiPromise();
  });

  it('gets validation data from parachain block head', async () => {
    const jsonValidationData = await getValidationData(
      mockApiInstance,
      mockParachainBlock
    );

    expect(jsonValidationData).toEqual(mockUnwrappedValidationData);
    expect(mockApiInstance.at).toHaveBeenCalled();
    expect(mockApiInstance.createType).toHaveBeenCalledWith(
      validationDataDataType,
      mockRawValidationData
    );
  });

  it(`doesn't get validation data from parachain block head`, async () => {
    mockApiInstance.createType.mockReturnValueOnce({
      isSome: false,
    } as any as Codec);

    const jsonValidationData = await getValidationData(
      mockApiInstance,
      mockParachainBlock
    );

    expect(mockApiInstance.at).toHaveBeenCalled();
    expect(jsonValidationData).toBeNull();
  });
});
