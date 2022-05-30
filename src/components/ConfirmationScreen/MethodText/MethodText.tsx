import styled from '@emotion/styled/macro';
import { useState } from 'react';
import JSONPretty from 'react-json-pretty';
import { Icon } from '../Icon/Icon';
import { Text, TextKind } from '../Text/Text';

export interface MethodTextProps {
  method: string;
  call: string;
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  gap: 8px;

  max-height: 235px;
  overflow-y: scroll;

  background: rgba(0, 0, 0, 0.15);
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const Method = styled.div`
  cursor: pointer;
`;

const IconWrapper = styled.div<{ show: boolean }>`
  transform: rotate(${(props) => (props.show ? 0 : 90)}deg);
`;

const Call = styled.div`
  font-family: 'Satoshi';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;

  word-break: break-all;
`;

const theme = {
  key: 'color:#D1DEE8;',
  string: 'color:#8AFFCB;',
  value: 'color:#8AFFCB;',
  boolean: 'color:#8AFFCB;',
};

export const MethodText = ({ method, call }: MethodTextProps) => {
  const [show, setShow] = useState(false);

  return (
    <Container onClick={() => setShow(!show)}>
      <Title>
        <IconWrapper show={show}>
          <Icon name={'PolygonUp'} size={9}></Icon>
        </IconWrapper>
        <Text
          id={'MethodCall.Title'}
          defaultMessage={'Method'}
          kind={TextKind.MethodCallTitle}
        ></Text>
      </Title>
      <Call>
        <Method>{method}</Method>
        {show && (
          <JSONPretty id="json-pretty" data={JSON.parse(call)} theme={theme} />
        )}
      </Call>
    </Container>
  );
};
