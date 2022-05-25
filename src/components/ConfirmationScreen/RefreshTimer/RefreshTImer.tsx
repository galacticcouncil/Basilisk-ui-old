import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Text, TextKind } from '../Text/Text';

export interface RefreshTimerProps {
  time: number;
}

const Timer = styled.div`
  width: 112px;
  height: 29px;
  background: #333037;
  border-radius: 3px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 112px;
  height: 29px;
`;

const slide = keyframes`
  {
    0%
    {
      filter: hue-rotate(0deg);
    }
    50%
    {
      filter: hue-rotate(360deg);
    }
    100%
    {
      filter: hue-rotate(0deg);
    }
  }
`;

const Loader = styled.div`
  width: 112px;
  height: 3px;
  position: relative;
  bottom: 3px;
  border-radius: 0px 0px 6px 6px;
  background-size: 200% 200%;
  background-position: 0% 100%;

  background: linear-gradient(
      89.92deg,
      #686876 10.87%,
      #686876 38.53%,
      #54ef9f 58.94%,
      #fcae33 84.56%
    ),
    #d9d9d9;

  animation: ${slide} 2s linear infinite;
`;

export const RefreshTimer = ({ time }: RefreshTimerProps) => {
  return (
    <Timer>
      <TextContainer>
        <Text
          kind={TextKind.Timer}
          id={'timer'}
          defaultMessage="Refresh in {time}s"
          values={{ time: time }}
        ></Text>
      </TextContainer>
      <Loader />
    </Timer>
  );
};
