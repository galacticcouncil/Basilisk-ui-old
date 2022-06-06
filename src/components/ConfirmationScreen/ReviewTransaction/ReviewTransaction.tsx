import styled from '@emotion/styled/macro';
import { Button, ButtonKind } from '../Button/Button';
import { ModalComponent } from '../ModalComponent/ModalComponent';
import { Table, TableProps } from '../Table/Table';
import { Text, TextKind } from '../Text/Text';
import { Stepper, StepperProps } from '../Stepper/Stepper';
import { MethodText, MethodTextProps } from '../MethodText/MethodText';

export interface ReviewTransactionProps {
  onCancel: () => void;
  onSign: () => void;
  methodCall: MethodTextProps;
  table: TableProps;
  steps?: StepperProps;
  loading?: boolean;
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

const StepperContainer = styled.div`
  width: 460px;
  padding-bottom: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

const TableContainer = styled.div`
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
`;

export const ReviewTransaction = ({
  onCancel,
  onSign,
  table,
  methodCall,
  steps,
  loading,
}: ReviewTransactionProps) => {
  return (
    <ModalComponent isOpen={true}>
      {steps && (
        <StepperContainer>
          <Stepper {...steps} />
        </StepperContainer>
      )}
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
          <MethodText {...methodCall} />
        </MethodCallContainer>
        <TableContainer>
          <Table {...table} />
        </TableContainer>
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
    </ModalComponent>
  );
};
