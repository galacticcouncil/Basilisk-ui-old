import { ApiPromise } from '@polkadot/api';
import { getRepayFee, repayFeeDataType } from './getRepayFee';

describe('getRepayFee', () => {
  const mockedRepayFee = ['2', '10'];
  const mockedCreateType = jest.fn();
  const getMockApiPromise = () =>
    ({
      consts: {
        lbp: {
          repayFee: mockedRepayFee,
        },
      },
      createType: mockedCreateType,
    } as unknown as ApiPromise);

  let apiInstance: ApiPromise;

  beforeEach(() => {
    apiInstance = getMockApiPromise();
    mockedCreateType.mockImplementationOnce((_, repayFee) => repayFee);
  });

  it('can get repay fee constant from apiInstance', async () => {
    const repayFee = getRepayFee(apiInstance);

    expect(mockedCreateType).toBeCalledWith(
      repayFeeDataType,
      apiInstance.consts.lbp.repayFee
    );
    expect(repayFee).toEqual({
      numerator: mockedRepayFee[0],
      denominator: mockedRepayFee[1],
    });
  });
});
