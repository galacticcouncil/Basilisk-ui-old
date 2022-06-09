import styled from '@emotion/styled/macro';
import { RadioButton } from '../RadioButton/RadioButton';
import { useIntl } from 'react-intl';
import { Input } from '../Input/Input';
import { createNumberMask } from 'text-mask-addons';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

type SlippageKey = 'radio' | 'custom';

export type Slippage = {
  [K in SlippageKey]?: string;
};

const SlippageSliderContainer = styled.div`
  width: 100%;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 11px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 8px;
  gap: 10px;
`;

const InputContainer = styled.div`
  height: 55px;
  width: 100px;
`;

export const SlippageSlider = () => {
  const intl = useIntl();
  const radios: number[] = [0.1, 0.5, 1, 3];
  const methods = useFormContext();

  useEffect(() => {
    methods.watch();
  }, [methods]);

  return (
    <SlippageSliderContainer>
      {radios.map((radio) => {
        return (
          <RadioButton
            key={radio}
            value={radio}
            onClick={() => {
              methods.setValue('slippage.radio', `${radio}`);
              methods.setValue('slippage.custom', undefined);
              methods.setValue('slippage.value', `${radio}`);
            }}
            checked={
              !methods.getValues('slippage.custom') &&
              `${methods.getValues('slippage.radio')}` === String(radio)
            }
            {...methods.register('slippage.radio')}
          />
        );
      })}
      <InputContainer>
        <Input
          {...methods.register('slippage.custom', {
            pattern: /^\d{1,2}[.]{0,1}\d{0,2}/i,
          })}
          onChange={(e) => {
            methods.setValue('slippage.custom', e.target.value);
            methods.setValue('slippage.value', `${e.target.value}`);
          }}
          placeholder={intl.formatMessage({
            id: 'Custom',
            defaultMessage: 'Custom',
          })}
          step={'0.1'}
          value={`${methods.getValues('slippage.custom')}`}
          unit={methods.getValues('slippage.custom') ? '%' : ''}
          mask={createNumberMask({
            prefix: '',
            suffix: '',
            allowDecimal: true,
            decimalSymbol: '.',
            decimalLimit: 2,
            integerLimit: 2,
            allowNegative: false,
            allowLeadingZeroes: false,
          })}
        />
      </InputContainer>
    </SlippageSliderContainer>
  );
};
