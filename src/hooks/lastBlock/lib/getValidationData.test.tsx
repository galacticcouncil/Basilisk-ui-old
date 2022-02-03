import { mockUsePolkadotJsContext } from '../../polkadotJs/tests/mockUsePolkadotJsContext';
import { getValidationData, validationDataDataType } from './getValidationData';

const mockedUsePolkadotJsContext = mockUsePolkadotJsContext();

describe('hooks/lastBlock/lib/getValidationData', () => {
  it('get validation data from parachain block head', async () => {
    expect.assertions(4);

    const rawValidationData = 'mockedRawValidationData';
    const result = 'result';

    (mockedUsePolkadotJsContext.apiInstance.at as jest.Mock).mockResolvedValue(
      mockedUsePolkadotJsContext.apiInstance
    );
    (
      mockedUsePolkadotJsContext.apiInstance.query.parachainSystem
        .validationData as any as jest.Mock
    ).mockResolvedValue(rawValidationData);
    (
      mockedUsePolkadotJsContext.apiInstance.createType as jest.Mock
    ).mockImplementationOnce(
      (validationDataDataTypeAttr, rawValidationDataAttr) => {
        expect(rawValidationDataAttr).toEqual(rawValidationData);
        expect(validationDataDataTypeAttr).toEqual(validationDataDataType);

        return {
          isSome: true,
          toJSON: () => ({ result }),
        };
      }
    );

    const hash = '123';
    const signedBlock: any = {
      block: { header: { hash } },
    };

    const u = await getValidationData(
      mockedUsePolkadotJsContext.apiInstance,
      signedBlock
    );

    expect(mockedUsePolkadotJsContext.apiInstance.at).toHaveBeenCalled();
    expect(u).toEqual({ result });
  });

  it('doesnt get validation data from parachain block head', async () => {
    expect.assertions(4);

    const rawValidationData = 'mockedRawValidationData';

    (mockedUsePolkadotJsContext.apiInstance.at as jest.Mock).mockResolvedValue(
      mockedUsePolkadotJsContext.apiInstance
    );
    (
      mockedUsePolkadotJsContext.apiInstance.query.parachainSystem
        .validationData as any as jest.Mock
    ).mockResolvedValue(rawValidationData);
    (
      mockedUsePolkadotJsContext.apiInstance.createType as jest.Mock
    ).mockImplementationOnce(
      (validationDataDataTypeAttr, rawValidationDataAttr) => {
        expect(rawValidationDataAttr).toEqual(rawValidationData);
        expect(validationDataDataTypeAttr).toEqual(validationDataDataType);

        return {
          isNone: true,
        };
      }
    );

    const hash = '123';
    const signedBlock: any = {
      block: { header: { hash } },
    };

    const u = await getValidationData(
      mockedUsePolkadotJsContext.apiInstance,
      signedBlock
    );

    expect(mockedUsePolkadotJsContext.apiInstance.at).toHaveBeenCalled();
    expect(u).toBeNull();
  });
});
