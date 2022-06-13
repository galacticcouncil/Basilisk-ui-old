import styled from '@emotion/styled/macro';

export interface ToggleProps {
  toggled?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  border-style: none;
`;

const Button = styled.button<{ checked: boolean }>`
  display: inline-flex;
  position: relative;
  padding: 4px 0;
  background: ${(props) => (props.checked ? '#1d2d26' : 'rgba(0, 0, 0, 0.25)')};
  width: 70px;
  border-radius: 9999px;
  border-width: 0px;

  &:disabled {
    background: rgba(0, 0, 0, 0.25);
  }
`;

const Span = styled.div<{ checked: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 100%;
  background: ${(props) => (props.checked ? '#49e49f' : '#A2B0B8')};

  transition-duration: 300ms;
  transform: translate(${(props) => (props.checked ? '36px' : '4px')});

  ${Button}:hover & {
    outline: 2px solid #8affcb;
  }

  ${Button}:disabled & {
    border-width: 0px;
    background: linear-gradient(0deg, #29292d, #29292d), #26282f;
  }

  ${Button}:disabled:hover & {
    outline: 0px;
    border-width: 0px;
    background: linear-gradient(0deg, #29292d, #29292d), #26282f;
  }
`;

export const Toggle = ({
  toggled = false,
  disabled = false,
  onClick,
}: ToggleProps) => {
  return (
    <ToggleContainer>
      <Input type="hidden" />
      <Button
        onClick={() => onClick()}
        disabled={disabled}
        checked={toggled}
        type="button"
        role="switch"
      >
        <Span checked={toggled} aria-hidden="true" />
      </Button>
    </ToggleContainer>
  );
};
