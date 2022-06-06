import { Icon, IconNames } from '../Icon/Icon';
import { Text, TextKind, TextProps } from '../Text/Text';
import styled from '@emotion/styled/macro';
import { variant } from 'styled-system';
import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator';

export enum ButtonKind {
  Primary = 'primary',
  Secondary = 'secondary',
  Loading = 'loading',
}

export interface ButtonProps {
  onClick?: () => void;
  text: TextProps;
  disabled?: boolean;
  kind?: ButtonKind;
  icon?: IconNames;
  big?: boolean;
}

const Content = styled.div<{ big: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: ${(props) => (props.big ? '13px 72px' : '13px 36px')};
`;

const ButtonComponent = styled('button')(
  {
    border: 'none',
    outline: 'none',
    padding: 0,
    background: 'none',
    userSelect: 'none',
    transition: 'background-color 300ms ease-out',
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
  big = false,
}: ButtonProps) => {
  return (
    <>
      <ButtonComponent
        variant={kind}
        onClick={onClick}
        disabled={disabled || kind === ButtonKind.Loading}
      >
        <Content big={big}>
          {kind === ButtonKind.Loading && <LoadingIndicator />}
          <Text {...text} kind={TextKind.Button} />
          {icon && <Icon name={icon} size={18} />}
        </Content>
      </ButtonComponent>
    </>
  );
};
