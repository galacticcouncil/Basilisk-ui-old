import Icon, { IconNames } from '../Icon/Icon';
import styled from '@emotion/styled';
import { variant } from 'styled-system';
import { keyframes } from '@emotion/react';

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
  padding: 16px 36px;
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

const LoadingIndicatorContainerSC = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding-right: 16px;
`;

const LoadingIndicatorWrapperSC = styled.div``;

const rotate = keyframes`
  {
      0%
    {
      transform: rotate(0deg);
      filter: hue-rotate(0deg);
    }
    100%
    {
      transform: rotate(360deg);
      filter: hue-rotate(360deg);
    }
  }
`;

const LoadingIndicatorSC = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(45deg, transparent, transparent 40%, #e5f403);
  animation: ${rotate} 2s linear infinite;

  &:before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    background: rgba(73, 228, 159, 0.05);
    border-radius: 50%;
    z-index: 1000;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: linear-gradient(45deg, transparent, transparent 40%, #e5f403);
    border-radius: 50%;
    z-index: 1;
    filter: blur(30px);
  }
`;

const ButtonSC = styled('button')(
  {
    border: 'none',
    outline: 'none',
    padding: 0,
    background: 'none',
    userSelect: 'none',
    textTransform: 'uppercase',
    transition: 'background-color 1s ease-out',
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
        cursor: 'wait',
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
          {variant === ButtonVariant.Loading && (
            <LoadingIndicatorContainerSC>
              <LoadingIndicatorWrapperSC>
                <LoadingIndicatorSC />
              </LoadingIndicatorWrapperSC>
            </LoadingIndicatorContainerSC>
          )}
          {iconLeft && (
            <IconContainerSC variant="left">
              <Icon name={iconLeft} />
            </IconContainerSC>
          )}
          {text}
          {iconRight && (
            <IconContainerSC variant="right">
              <Icon name={iconRight} />
            </IconContainerSC>
          )}
        </TextContainerSC>
      </ButtonSC>
    </>
  );
};
