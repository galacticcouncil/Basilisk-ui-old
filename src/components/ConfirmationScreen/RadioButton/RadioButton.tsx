import styled from '@emotion/styled/macro';
import { Text, TextKind } from '../Text/Text';
export interface RadioButtonProps {
  value?: number;
  checked?: boolean;
  custom?: boolean;
  onChange?: () => void;
}

const RadioButtonContainer = styled.label<{ checked: boolean }>`
  user-select: 'none';
  display: flex;
  justify-content: center;
  align-items: center;
  width: 55px;
  height: 55px;

  background: ${(props) =>
    props.checked
      ? 'linear-gradient(90deg, #ffce4f 1.27%, #4fffb0 104.14%)'
      : 'transparent'};
  border-radius: 9px;

  color: ${(props) => (props.checked ? '#000000' : '#ffffff')};

  &:hover {
    background: ${(props) => !props.checked && '#211F24'};
  }
`;

const InputComponent = styled.input`
  height: 0%;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  visibility: collapse;
  width: 0;
`;

export const RadioButton = ({ value, checked = false }: RadioButtonProps) => {
  return (
    <>
      <RadioButtonContainer checked={checked}>
        <InputComponent checked={checked} value={value} type={'radio'} />
        <Text id={`${value}%`} kind={TextKind.RadioButton} />
      </RadioButtonContainer>
    </>
  );
};
