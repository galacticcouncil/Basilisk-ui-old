import { Icon, IconNames } from '../Icon/Icon';
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
  icon?: IconNames;
}

const ContentSC = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 36px;
`;

const TextContainerSC = styled.div`
  font-family: 'Satoshi';
  font-style: bold;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
`;

const IconContainerSC = styled.div`
  width: 16px;
  height: 16px;
  margin-left: 8px;
`;

const LoadingIndicatorContainerSC = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  margin-right: 8px;
`;

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
  animation: ${rotate} 2s linear infinite;
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
  variant = ButtonVariant.Primary,
  icon,
}: ButtonProps) => {
  return (
    <>
      <ButtonSC
        variant={variant}
        onClick={onClick}
        disabled={disabled || variant === ButtonVariant.Loading}
      >
        <ContentSC>
          {variant === ButtonVariant.Loading && (
            <LoadingIndicatorContainerSC>
              <LoadingIndicatorSC>
                <Icon name="Loading" size={16} />
              </LoadingIndicatorSC>
            </LoadingIndicatorContainerSC>
          )}
          <TextContainerSC>{text}</TextContainerSC>
          {icon && (
            <IconContainerSC>
              <Icon name={icon} size={16} />
            </IconContainerSC>
          )}
        </ContentSC>
      </ButtonSC>
    </>
  );
};
