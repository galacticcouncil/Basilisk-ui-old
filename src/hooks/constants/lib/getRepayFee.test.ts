import { ApiPromise } from '@polkadot/api';
import { getRepayFee, repayFeeDataType } from './getRepayFee';

let mockedRepayFee = '';
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

describe('getRepayFee', () => {
  let apiInstance: ApiPromise;
  const mockedRepayFeeValue = ['2', '10'];

  beforeEach(() => {
    mockedRepayFee = 'repayFeeUntyped';
    mockedCreateType.mockReturnValueOnce(mockedRepayFeeValue);
    apiInstance = getMockApiPromise();
  });

  it('can get repay fee constant from apiInstance', async () => {
    const repayFee = getRepayFee(apiInstance);

    expect(mockedCreateType).toBeCalledWith(
      repayFeeDataType,
      apiInstance.consts.lbp.repayFee
    );
    expect(repayFee.numerator).toBe(mockedRepayFeeValue[0]);
    expect(repayFee.denominator).toBe(mockedRepayFeeValue[1]);
  });
});
