import styled from '@emotion/styled/macro';
import { Button, ButtonKind } from '../Button/Button';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { Icon } from '../Icon/Icon';
import { ModalComponent } from '../ModalComponent/ModalComponent';
import { Stepper, StepperProps } from '../Stepper/Stepper';
import { Text, TextKind } from '../Text/Text';

export interface UpdateVersionsProps {
  oldVersion?: string;
  newVersion: string;
}

export interface UpdateMetadataProps extends UpdateVersionsProps {
  onUpdateMetadata: () => void;
  onCancel: () => void;
  loading?: boolean;
  isOpened?: boolean;
  error?: string;
  steps?: StepperProps;
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
  padding: 30px;
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
`;

const TextWrapper = styled.div`
  padding: 8px 30px 11px 30px;
  text-align: center;
`;

const Spacer = styled.div<{ padding?: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${(props) => (props.padding ? props.padding : '0px 0px 40px 0px')};
`;

const UpdateVersionsContainer = styled.div`
  width: 400px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid #787e82;
  border-radius: 16px;
  padding: 6px;
`;

const Version = styled.div<{ new?: boolean }>`
  width: 195px;
  height: 81px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${(props) => (props.new ? 'flex-end' : 'flex-start')};
  background: ${(props) => props.new && 'rgba(218, 255, 238, 0.06)'};
  border-radius: 12px;
  color: ${(props) => (props.new ? '#4CF3A8' : '#787e82')};
  padding: 10px;
  overflow: hidden;
`;

const Container = styled.div`
  width: 100%;
`;

const UpdateVersions = ({ oldVersion, newVersion }: UpdateVersionsProps) => {
  return (
    <UpdateVersionsContainer>
      <Version>
        <Text
          id={'oldVersion'}
          defaultMessage={'Old Version'}
          kind={TextKind.MetadataUpdateLabel}
        />
        <Text
          id={oldVersion || 'unknownVersion'}
          defaultMessage={oldVersion || 'Unknown Version'}
          kind={TextKind.MetadataUpdateValue}
        />
      </Version>
      <Version new={true}>
        <Text
          id={'newVersion'}
          defaultMessage={'New Version'}
          kind={TextKind.MetadataUpdateLabel}
        />
        <Text
          id={newVersion}
          defaultMessage={newVersion}
          kind={TextKind.MetadataUpdateValue}
        />
      </Version>
    </UpdateVersionsContainer>
  );
};

export const UpdateMetadata = ({
  oldVersion,
  newVersion,
  onUpdateMetadata,
  onCancel,
  isOpened = false,
  loading = false,
  error,
  steps,
}: UpdateMetadataProps) => {
  return (
    <ModalComponent isOpen={isOpened}>
      {steps && (
        <StepperContainer>
          <Stepper {...steps} />
        </StepperContainer>
      )}
      <ModalContainer>
        <Spacer>
          <Icon name={'UpdateMetadata'} size={135} />
          <Spacer padding="11px 0px 0px 0px">
            <Text
              id={'updateMetadata'}
              defaultMessage={'Update Metadata'}
              kind={TextKind.Title}
            />
          </Spacer>
          <TextWrapper>
            <Text
              id={'updateMetadataText'}
              defaultMessage={
                'Before reviewing your transaction, please update the metadata in your wallet.'
              }
              kind={TextKind.Text}
            />
          </TextWrapper>
          <Text
            id={'updateMetadataMoreInfo'}
            defaultMessage={'More Info'}
            kind={TextKind.TextUrl}
          />
        </Spacer>
        <Spacer>
          <UpdateVersions oldVersion={oldVersion} newVersion={newVersion} />
          {error && (
            <Spacer padding={'12px 0px 0px 0px'}>
              <Container>
                <ErrorMessage text={error} />
              </Container>
            </Spacer>
          )}
        </Spacer>
        {loading ? (
          <>
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
          </>
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
                id: 'update',
                defaultMessage: 'Update',
              }}
              onClick={() => onUpdateMetadata()}
              kind={ButtonKind.Primary}
              big={true}
            />
          </ButtonGroup>
        )}
      </ModalContainer>
    </ModalComponent>
  );
};
