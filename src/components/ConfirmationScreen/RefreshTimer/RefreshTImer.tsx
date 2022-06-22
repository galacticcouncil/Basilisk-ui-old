import { keyframes } from '@emotion/react';
import styled from '@emotion/styled/macro';
import { Text } from '../Text/Text';
import { TextKind } from '../Text/TextTheme';

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

const gradient = keyframes`
  {
    0%   { background-position: 0 0; }
    100% { background-position: -750% 0; }
  }
`;

const Loader = styled.div`
  width: 112px;
  height: 3px;
  position: relative;
  overflow: hidden;
  bottom: 3px;
  border-radius: 0px 0px 6px 6px;

  background: repeating-linear-gradient(
    to right,
    #7702ff,
    #02ff70,
    #ff00d4,
    #ffa000,
    #00fdff,
    #7702ff
  );
  background-size: 750% auto;
  background-position: 0 100%;
  animation: ${gradient} 17s infinite;
  animation-fill-mode: forwards;
  animation-timing-function: linear;
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
