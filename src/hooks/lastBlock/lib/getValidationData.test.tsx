import { ApiPromise } from '@polkadot/api';
import { SignedBlock } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import { getValidationData, validationDataDataType } from './getValidationData';

const rawValidationData = 'mockedRawValidationData';
const mockJsonValidationData = 'result';
const parachainBlock = {
  block: { header: { hash: 'hash' } },
} as unknown as SignedBlock;

export const getMockApiPromise = (): jest.Mocked<ApiPromise> =>
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
        unwrap: () => ({ mockJsonValidationData }),
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
      parachainBlock
    );

    expect(jsonValidationData).toEqual({ mockJsonValidationData });
    expect(mockApiInstance.at).toHaveBeenCalled();
    expect(mockApiInstance.createType).toHaveBeenCalledWith(
      validationDataDataType,
      rawValidationData
    );
  });

  it(`doesn't get validation data from parachain block head`, async () => {
    mockApiInstance.createType.mockReturnValueOnce({
      isSome: false,
    } as any as Codec);

    const jsonValidationData = await getValidationData(
      mockApiInstance,
      parachainBlock
    );

    expect(mockApiInstance.at).toHaveBeenCalled();
    expect(jsonValidationData).toBeNull();
  });
});
