import styled from '@emotion/styled/macro';
import { AssetInput, AssetInputProps } from '../AssetInput/AssetInput';
import { Button, ButtonKind, ButtonPadding } from '../Button/Button';
import { Table, TableProps } from '../Table/Table';
import { Text } from '../Text/Text';
import { TextKind } from '../Text/TextTheme';
import { RefreshTimer } from '../RefreshTimer/RefreshTImer';
import { Icon } from '../Icon/Icon';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

export interface ConfirmSwapProps {
  onCancel: () => void;
  onReview: () => void;
  assetIn: AssetInputProps;
  assetOut: AssetInputProps;
  table: TableProps;
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

const AssetGroup = styled.div`
  width: 100%;
  padding: 0px;
  position: relative;
`;

const AssetDivider = styled.div`
  border-bottom: 1px solid #51515f;
  opacity: 0.3;
`;

const Container = styled.div`
  width: 100%;
  padding: 0px 30px;
`;

const IconContainer = styled.div`
  position: absolute;
  left: 218px;
  bottom: 108px;
`;

const RefreshTimerContainer = styled.div`
  position: absolute;
  right: 38px;
  top: -15px;
`;

export const ConfirmSwap = ({
  onCancel,
  onReview,
  assetIn,
  assetOut,
  table,
  nextBlockTime,
  error,
}: ConfirmSwapProps) => {
  return (
    <ModalContainer>
      <TextWrapper>
        <Text
          id={'confirmSwap.Title'}
          defaultMessage={'Confirm Swap'}
          kind={TextKind.Title}
        />
        <Text
          id={'confirmSwap.Subtitle'}
          defaultMessage={'Please review your transaction'}
          kind={TextKind.Text}
        />
      </TextWrapper>
      <AssetGroup>
        <RefreshTimerContainer>
          <RefreshTimer time={nextBlockTime || 0} />
        </RefreshTimerContainer>
        <AssetInput {...assetIn} />
        <AssetDivider />
        <IconContainer>
          <Icon name={'ArrowAssetPicker'} />
        </IconContainer>
        <AssetInput {...assetOut} />
      </AssetGroup>
      <Container>
        <Table {...table} />
      </Container>
      <Container>{error && <ErrorMessage text={error} />}</Container>
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
            id: 'review',
            defaultMessage: 'Review',
          }}
          onClick={() => onReview()}
          kind={ButtonKind.Primary}
          disabled={error ? true : false}
          padding={ButtonPadding.Big}
        />
      </ButtonGroup>
    </ModalContainer>
  );
};
