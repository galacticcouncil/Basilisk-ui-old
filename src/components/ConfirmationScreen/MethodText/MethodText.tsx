import styled from '@emotion/styled/macro';
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

  cursor: pointer;
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px;
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
  return (
    <Container>
      <Title>
        <Icon name={'PolygonUp'} size={9}></Icon>
        <Text
          id={'MethodCall.Title'}
          defaultMessage={'Method'}
          kind={TextKind.MethodCallTitle}
        ></Text>
      </Title>
      <Call>
        {method}
        <JSONPretty id="json-pretty" data={JSON.parse(call)} theme={theme} />
      </Call>
    </Container>
  );
};
