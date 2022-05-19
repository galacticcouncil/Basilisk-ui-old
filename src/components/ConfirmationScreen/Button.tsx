import Icon, { IconNames } from '../Icon/Icon';
import styled from '@emotion/styled';
import { variant } from 'styled-system';

export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Loading = 'loading',
}

export interface ButtonProps {
  onClick: () => void;
  text: string;
  disabled?: boolean;
  variant?: ButtonVariant;
  iconLeft?: IconNames;
  iconRight?: IconNames;
}

const TextContainerSC = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 16px;
`;

const IconContainerSC = styled('div')(
  {
    width: '24px',
    height: '24px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  variant({
    variants: {
      left: {
        paddingRight: '8px',
      },
      right: {
        paddingLeft: '8px',
      },
    },
  })
);

const ButtonSC = styled('button')(
  {
    border: 'none',
    outline: 'none',
    padding: 0,
    background: 'none',
    userSelect: 'none',
    textTransform: 'uppercase',

    borderRadius: '9999px',
    fontWeight: 'bold',
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
          background: 'linear-gradient(0deg, #44444A, #44444A), #3E3E4B',
          color: 'white',
          opacity: '0.6',
        },
      },
      loading: {
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
  variant = ButtonVariant.Primary,
  iconLeft,
  iconRight,
}: ButtonProps) => {
  return (
    <>
      <ButtonSC variant={variant} onClick={onClick} disabled={disabled}>
        <TextContainerSC>
          <IconContainerSC variant="left">
            {iconLeft && <Icon name={iconLeft} />}
          </IconContainerSC>
          {text}
          <IconContainerSC variant="right">
            {iconRight && <Icon name={iconRight} />}
          </IconContainerSC>
        </TextContainerSC>
      </ButtonSC>
    </>
  );
};
