import { Icon, IconNames } from '../Icon/Icon';
import { Text, TextKind } from '../Text/Text';
import styled from '@emotion/styled';
import { variant } from 'styled-system';
import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator';

export enum ButtonKind {
  Primary = 'primary',
  Secondary = 'secondary',
  Loading = 'loading',
}

export interface ButtonProps {
  onClick: () => void;
  text: string;
  disabled?: boolean;
  kind?: ButtonKind;
  icon?: IconNames;
}

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 36px;
`;

const IconContainer = styled.div`
  width: 16px;
  height: 16px;
  margin-left: 8px;
`;

const LoadingIndicatorContainer = styled.div`
  margin-right: 8px;
`;

const ButtonComponent = styled('button')(
  {
    border: 'none',
    outline: 'none',
    padding: 0,
    background: 'none',
    userSelect: 'none',
    transition: 'background-color 1s ease-out',
    borderRadius: '9999px',
    width: '100%',
  },
  variant({
    variants: {
      primary: {
        background: '#4FFFB0',
        color: 'black',
        width: 'fit-content',
        '&:hover': {
          background: '#8AFFCB',
        },
        '&:active': {
          background: '#49E49F',
        },
        '&:disabled': {
          cursor: 'not-allowed',
          background: 'linear-gradient(0deg, #44444A, #44444A), #3E3E4B',
          color: 'white',
          opacity: '0.6',
        },
      },
      secondary: {
        background: 'rgba(76, 243, 168, 0.12)',
        color: '#4FFFB0',
        width: 'fit-content',
        '&:hover': {
          background: 'rgba(76, 243, 168, 0.3)',
        },
        '&:active': {
          background: 'rgba(76, 243, 168, 0.5);',
          color: '#B8FFDF',
        },
        '&:disabled': {
          cursor: 'not-allowed',
          background: 'linear-gradient(0deg, #44444A, #44444A), #3E3E4B',
          color: 'white',
          opacity: '0.6',
        },
      },
      loading: {
        cursor: 'progress',
        background: 'rgba(73, 228, 159, 0.05)',
        color: '#4FFFB0',
      },
    },
  })
);

export const Button = ({
  onClick,
  text,
  disabled = false,
  kind = ButtonKind.Primary,
  icon,
}: ButtonProps) => {
  return (
    <>
      <ButtonComponent
        variant={kind}
        onClick={onClick}
        disabled={disabled || kind === ButtonKind.Loading}
      >
        <Content>
          {kind === ButtonKind.Loading && (
            <LoadingIndicatorContainer>
              <LoadingIndicator />
            </LoadingIndicatorContainer>
          )}
          <Text id={text} kind={TextKind.Button} />
          {icon && (
            <IconContainer>
              <Icon name={icon} size={16} />
            </IconContainer>
          )}
        </Content>
      </ButtonComponent>
    </>
  );
};
