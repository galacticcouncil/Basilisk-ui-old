import styled from '@emotion/styled/macro';
import { RadioButton } from '../RadioButton/RadioButton';
import { useIntl } from 'react-intl';
import { Input } from '../Input/Input';

type SlippageKey = 'radio' | 'custom';

export type Slippage = {
  [K in SlippageKey]?: number;
};

export interface SlippageSliderProps {
  slippage: Slippage;
  onChange?: (slippage: number) => void;
}

const SlippageSliderContainer = styled.div`
  background: rgba(0, 0, 0, 0.25);
  border-radius: 11px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 0px;
  margin: 0px 30px;
  gap: 10px;
`;

const RadioButtonContainer = styled.div``;

const InputContainer = styled.div`
  height: 55px;
  width: 100px;
`;

export const SlippageSlider = ({
  slippage = { radio: 0.5 },
  onChange,
}: SlippageSliderProps) => {
  const intl = useIntl();
  const radios: number[] = [0.1, 0.5, 1, 3];

  return (
    <SlippageSliderContainer>
      {radios.map((radio) => {
        return (
          <RadioButtonContainer onClick={() => onChange && onChange(radio)}>
            <RadioButton
              value={radio}
              checked={!slippage.custom && Number(slippage.radio) === radio}
            />
          </RadioButtonContainer>
        );
      })}
      <InputContainer>
        <Input
          placeholder={intl.formatMessage({
            id: 'Custom',
            defaultMessage: 'Custom',
          })}
          step={'0.1'}
          value={`${slippage.custom ? String(slippage.custom) : undefined}`}
          unit={slippage.custom ? '%' : ''}
        />
      </InputContainer>
    </SlippageSliderContainer>
  );
};
