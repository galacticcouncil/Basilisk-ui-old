import styled from '@emotion/styled/macro';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon } from '../Icon/Icon';
import { TextTheme, TextStyle, TextKind } from './TextTheme';

export interface TextProps {
  id: string;
  kind?: TextKind;
  defaultMessage?: string;
  description?: string;
  values?: Record<string, ReactNode>;
  styles?: TextStyle;
}

const TextContainer = styled.div`
  width: fit-content;
`;

const TextGradient = `
  background: linear-gradient(90deg, #4FFFB0 1.27%, #B3FF8F 48.96%, #FF984E 104.14%), linear-gradient(90deg, #4FFFB0 1.27%, #A2FF76 53.24%, #FF984E 104.14%), linear-gradient(90deg, #FFCE4F 1.27%, #4FFFB0 104.14%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const TextComponent = styled.div<{ styles?: TextStyle }>`
  font-family: 'Satoshi';
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: ${(props) => props.styles?.textAlign ?? 'center'};
  font-style: ${(props) => props.styles?.fontStyle ?? 'normal'};
  font-weight: ${(props) => props.styles?.fontWeight ?? '400'};
  font-size: ${(props) => props.styles?.fontSize ?? '16px'};
  line-height: ${(props) => props.styles?.lineHeight ?? '22px'};
  text-transform: ${(props) => props.styles?.textTransform ?? 'none'};
  color: ${(props) => props.styles?.color ?? 'inherit'};
  opacity: ${(props) => props.styles?.opacity ?? '1'};
  border-bottom: ${(props) => props.styles?.borderBottom ?? 'none'};
  letter-spacing: ${(props) => props.styles?.letterSpacing ?? 'transparent'};
  ${(props) => props.styles?.gradient && TextGradient};
`;

export const Text = ({
  id,
  kind = TextKind.Text,
  defaultMessage,
  description,
  values,
  styles,
}: TextProps) => (
  <TextContainer>
    <TextComponent styles={styles || TextTheme[kind]}>
      <FormattedMessage
        id={id}
        defaultMessage={defaultMessage || id}
        description={description}
        values={values}
      />
      {kind === TextKind.TextUrl && <Icon name={'Url'} size={12} />}
    </TextComponent>
  </TextContainer>
);
