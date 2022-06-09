import styled from '@emotion/styled/macro';
import { Button, ButtonKind } from '../Button/Button';
import { Icon, IconNames } from '../Icon/Icon';
import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator';
import { Text, TextKind, TextProps } from '../Text/Text';

export type SentTransactionStatus = 'sent' | 'error' | 'submitted';

type SentTransactionVariantValues = {
  title: TextProps;
  subtitle: TextProps;
  actionLabel: TextProps;
  actionKind: ButtonKind;
  icon?: IconNames;
  url?: TextProps;
};

type SentTransactionVariants = {
  [key in SentTransactionStatus]: SentTransactionVariantValues;
};

export interface SentTransactionProps {
  onAction: () => void;
  status: SentTransactionStatus;
}

const ModalContainer = styled.div<{ closeIn?: number }>`
  width: 460px;
  height: 460px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #211f24;
  box-shadow: 0px 38px 46px rgba(0, 0, 0, 0.03);
  border-radius: 16px;
  padding: 30px;
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const TextWrapper = styled.div`
  padding: 8px 0px 37px 0px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const IconContainer = styled.div`
  padding-bottom: 11px;
`;

const UrlContainer = styled.div`
  padding-top: 10px;
`;

const allStates: SentTransactionVariants = {
  sent: {
    title: {
      id: 'submittingTransactionTitle',
      defaultMessage: 'Submitting...',
      kind: TextKind.Title,
    },
    subtitle: {
      id: 'submittingTransactionSubtitle',
      defaultMessage:
        'Fantastic! Data has been broadcasted and awaits confirmation on the blockchain.',
    },
    actionLabel: {
      id: 'close',
      defaultMessage: 'Close',
    },
    actionKind: ButtonKind.Secondary,
    icon: 'LoadingBig',
  },
  error: {
    title: {
      id: 'failedTransactionTitle',
      defaultMessage: 'Failed to Submit',
      kind: TextKind.TitleError,
    },
    subtitle: {
      id: 'failedTransactionSubtitle',
      defaultMessage:
        'Unfortunately there was an issue while  broadcasting your transaction. Please try again later.',
    },
    actionLabel: {
      id: 'close',
      defaultMessage: 'Close',
    },
    actionKind: ButtonKind.Secondary,
    icon: 'TransactionError',
    url: {
      id: 'reviewActionLog',
      defaultMessage: 'Review Action Log',
    },
  },
  submitted: {
    title: {
      id: 'submittedTransactionTitle',
      defaultMessage: 'Submitted',
      kind: TextKind.Title,
    },
    subtitle: {
      id: 'submittedTransactionSubtitle',
      defaultMessage:
        'Fantastic! Data has been broadcasted and awaits confirmation on the blockchain.',
    },
    actionLabel: {
      id: 'done',
      defaultMessage: 'Done',
    },
    actionKind: ButtonKind.Primary,
    icon: 'TransactionDone',
    url: {
      id: 'reviewActionLog',
      defaultMessage: 'Review Action Log',
    },
  },
};

export const SentTransaction = ({ onAction, status }: SentTransactionProps) => {
  const { title, subtitle, actionLabel, actionKind, icon, url } =
    allStates[status];

  const hideFrom = 5;

  return (
    <ModalContainer closeIn={hideFrom}>
      {icon && (
        <IconContainer>
          {icon === 'LoadingBig' ? (
            <LoadingIndicator big={true} size={117} />
          ) : (
            <Icon name={icon} size={117} />
          )}
        </IconContainer>
      )}
      <Text {...title} />
      <TextWrapper>
        <Text {...subtitle} kind={TextKind.Text} />
      </TextWrapper>
      <ButtonGroup>
        <Button
          text={actionLabel}
          onClick={() => onAction()}
          kind={actionKind}
          big={true}
        />
      </ButtonGroup>
      {url && (
        <UrlContainer>
          <Text {...url} kind={TextKind.TextUrl} />
        </UrlContainer>
      )}
    </ModalContainer>
  );
};
