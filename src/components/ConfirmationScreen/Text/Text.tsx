import styled from '@emotion/styled';
import { FormattedMessage } from 'react-intl';
import { variant } from 'styled-system';

export enum TextVariant {
  Button = 'button',
  ButtonLoading = 'buttonLoading',
  TableButton = 'tableButton',
  Text = 'text',
  TextUrl = 'textUrl',
  TextError = 'textError',
  Title = 'title',
  TitleError = 'titleError',
  RowLabel = 'rowLabel',
  RowValue = 'rowValue',
}

export interface TextProps {
  id: string;
  variant?: TextVariant;
  defaultMessage?: string;
}

const TextContainerSC = styled.div`
  width: fit-content;
`;

const TextSC = styled('div')(
  {
    fontFamily: 'Satoshi',
  },
  variant({
    variants: {
      button: {
        textAlign: 'center',
        fontStyle: 'bold',
        fontWeight: '700',
        fontSize: '14px',
        lineHeight: '18px',
        textTransform: 'uppercase',
      },
      tableButton: {
        textAlign: 'center',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '18px',

        color: '#8AFFCB',
      },
      buttonLoading: {
        textAlign: 'center',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '22px',

        color: '#F7BF06',
      },
      text: {
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '16px',
        lineHeight: '22px',

        color: '#daffee',
        opacity: '0.6',
      },
      textUrl: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '22px',

        color: '#4CF3A8',
        borderBottom: '1px solid #4CF3A8',
      },
      textError: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '20px',

        color: '#FFFFFF',
      },
      title: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '24px',
        lineHeight: '32px',
        letterSpacing: '0.01em',

        background:
          'linear-gradient(90deg,#ffce4f 1.27%, rgba(79, 255, 176, 0) 104.14%),#4fffb0',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
        'background-clip': 'text',
        'text-fill-color': 'transparent',
      },
      titleError: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '24px',
        lineHeight: '32px',
        letterSpacing: '0.01em',

        color: '#FF6868',
      },
      rowLabel: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '15px',
        lineHeight: '20px',

        color: '#BDCCD4',
        opacity: '0.8',
      },
      rowValue: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '15px',
        lineHeight: '20px',

        color: '#FFFFFF',
      },
    },
  })
);

export const Text = ({
  id,
  variant = TextVariant.Text,
  defaultMessage,
}: TextProps) => (
  <TextContainerSC>
    <TextSC variant={variant}>
      <FormattedMessage id={id} defaultMessage={defaultMessage || id} />
    </TextSC>
  </TextContainerSC>
);
