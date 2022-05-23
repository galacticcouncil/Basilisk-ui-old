import { Icon } from '../Icon/Icon';
import { Text, TextVariant } from '../Text/Text';
import styled from '@emotion/styled';

export interface ErrorMessageProps {
  text: string;
}

const ContentSC = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 12px 23px 12px 12px;
  gap: 5px;

  background: rgba(255, 104, 104, 0.3);
  border-radius: 8px;
`;

const IconSC = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 3px 10px;
  gap: 10px;

  width: 41.85px;
  height: 25.61px;
`;

export const ErrorMessage = ({ text }: ErrorMessageProps) => {
  return (
    <>
      <ContentSC>
        <IconSC>
          <Icon name={'Error'} />
        </IconSC>
        <Text id={text} variant={TextVariant.TextError} />
      </ContentSC>
    </>
  );
};
