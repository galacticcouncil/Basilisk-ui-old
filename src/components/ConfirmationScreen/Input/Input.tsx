import styled from '@emotion/styled/macro';
import MaskedInput from 'react-text-mask';
import { useFormContext } from 'react-hook-form';
import { mask as defaultMask } from '../helpers/mask';
import { Text, TextProps } from '../Text/Text';
import { TextKind } from '../Text/TextTheme';
import { Tooltip } from '../Tooltip/Tooltip';
import { ChangeEvent, useCallback } from 'react';

export interface InputProps {
  name: string;
  disabled?: boolean;
  label?: TextProps;
  value?: string;
  unit?: string;
  placeholder?: string;
  step?: string;
  error?: TextProps;
  tooltip?: TextProps;
  mask?: any;
  onFocus?: () => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Content = styled.div<{ disabled: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 5px;
  isolation: isolate;
  /* height: 82px; */
  opacity: ${(props) => (props.disabled ? '0.5' : '1')};
`;

const LabelContainer = styled.div`
  height: 22px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: space-between;
`;

const Unit = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 54px;
  position: absolute;
  right: 18px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: flex-start;
  width: 100%;
  position: relative;
`;

const InputComponent = styled.input`
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  width: 100%;
  background: linear-gradient(0deg, #29292d, #29292d), #26282f;
  border-radius: 9px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 14.5px 18px;

  font-family: 'Satoshi';
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  line-height: 100%;

  color: #ffffff;

  ::placeholder {
    color: #ffffff;
    opacity: 0.4;
  }

  &:hover {
    background: linear-gradient(0deg, #44444a, #44444a), #3e3e4b;
    border: 1px solid #686876;
  }

  &:focus {
    background: linear-gradient(0deg, #44444a, #44444a), #3e3e4b;
    border: 1px solid #8affcb;
  }

  &:invalid {
    background: linear-gradient(0deg, #29292d, #29292d), #26282f;
    border: 1px solid #ff8a8a;
  }

  &:hover:disabled {
    background: linear-gradient(0deg, #29292d, #29292d), #26282f;
    border: 1px solid rgba(255, 255, 255, 0.4);
  }
`;

const TextContainer = styled.div`
  margin-right: auto;
`;

const TooltipContainer = styled.div`
  margin-left: auto;
`;

export const Input = ({
  name,
  disabled = false,
  label,
  value,
  unit,
  placeholder = '00.00',
  step = 'any',
  error,
  tooltip,
  mask = defaultMask,
  onFocus,
  onChange,
}: InputProps) => {
  const methods = useFormContext();
  const handleOnFocus = useCallback(() => onFocus && onFocus(), [onFocus]);
  const handleOnChange = useCallback(
    (e) => onChange && onChange(e),
    [onChange]
  );

  return (
    <Content disabled={disabled}>
      {label && tooltip && (
        <LabelContainer>
          {label && (
            <TextContainer>
              <Text {...label} kind={TextKind.InputLabel} />
            </TextContainer>
          )}
          {tooltip && (
            <TooltipContainer>
              <Tooltip {...tooltip} />
            </TooltipContainer>
          )}
        </LabelContainer>
      )}
      <InputContainer>
        <MaskedInput
          {...methods.register(name)}
          mask={mask}
          disabled={disabled}
          placeholder={placeholder}
          step={step}
          value={value && value}
          onFocus={handleOnFocus}
          onChange={handleOnChange}
          render={(ref, props) => (
            // After discussing with math0rz we've decided to get a little cheeky here
            <InputComponent ref={ref as any} {...props} />
          )}
        />
        <Unit>{unit && <Text id={unit} kind={TextKind.InputSymbol} />}</Unit>
      </InputContainer>
      {error && (
        <LabelContainer>
          <Text {...error} kind={TextKind.InputError} />
        </LabelContainer>
      )}
    </Content>
  );
};
