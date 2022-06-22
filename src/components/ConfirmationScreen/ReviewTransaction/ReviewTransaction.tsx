import styled from '@emotion/styled/macro';
import { Button, ButtonKind } from '../Button/Button';
import { Table, TableProps } from '../Table/Table';
import { Text } from '../Text/Text';
import { TextKind } from '../Text/TextTheme';
import { MethodText, MethodTextProps } from '../MethodText/MethodText';
import { RefreshTimer } from '../RefreshTimer/RefreshTImer';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

export interface ReviewTransactionProps {
  onCancel: () => void;
  onSign: () => void;
  methodCall: MethodTextProps;
  table: TableProps;
  loading?: boolean;
  nextBlockTime?: number;
  error?: string;
}

const ModalContainer = styled.div`
  width: 460px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #211f24;
  box-shadow: 0px 38px 46px rgba(0, 0, 0, 0.03);
  border-radius: 16px;
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 19px 30px 30px 30px;
`;

const TextWrapper = styled.div`
  padding: 30px 30px 23px 30px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 6px;
`;

const Container = styled.div`
  width: 100%;
  padding: 0px 30px;
`;

const Spacer = styled.div<{ padding?: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${(props) => (props.padding ? props.padding : '0px 0px 40px 0px')};
`;

const MethodCallContainer = styled.div`
  width: 100%;
  padding: 19px 0px 0px 30px;
  background: rgba(0, 0, 0, 0.15);
  position: relative;
`;

const RefreshTimerContainer = styled.div`
  position: absolute;
  right: 38px;
  top: -15px;
`;

export const ReviewTransaction = ({
  onCancel,
  onSign,
  table,
  methodCall,
  loading,
  nextBlockTime,
  error,
}: ReviewTransactionProps) => {
  return (
    <ModalContainer>
      <TextWrapper>
        <Text
          id={'ReviewTransaction.Title'}
          defaultMessage={'Review Transaction Details'}
          kind={TextKind.Title}
        />
        <Text
          id={'ReviewTransaction.Subtitle'}
          defaultMessage={'Please review your transaction'}
          kind={TextKind.Text}
        />
      </TextWrapper>
      <MethodCallContainer>
        <RefreshTimerContainer>
          <RefreshTimer time={nextBlockTime || 0} />
        </RefreshTimerContainer>
        <MethodText {...methodCall} />
      </MethodCallContainer>
      <Container>
        <Table {...table} />
      </Container>
      <Container>{error && <ErrorMessage text={error} />}</Container>
      {loading ? (
        <Spacer padding="0px 30px 30px 30px">
          <Button
            text={{
              id: 'signatureWaitingMessage',
              defaultMessage: 'Waiting for signature',
            }}
            kind={ButtonKind.Loading}
          />
          <Spacer padding="10px 0px 0px 0px">
            <Text
              id={'updatingMetadataTooltip'}
              defaultMessage={
                'Please accept update through your wallet extension.'
              }
              kind={TextKind.ButtonLoading}
            />
          </Spacer>
        </Spacer>
      ) : (
        <ButtonGroup>
          <Button
            text={{
              id: 'cancel',
              defaultMessage: 'Cancel',
            }}
            onClick={() => onCancel()}
            kind={ButtonKind.Secondary}
          />
          <Button
            text={{
              id: 'sign',
              defaultMessage: 'sign & send',
            }}
            onClick={() => onSign()}
            kind={ButtonKind.Primary}
            icon={'Wallet'}
          />
        </ButtonGroup>
      )}
    </ModalContainer>
  );
};
