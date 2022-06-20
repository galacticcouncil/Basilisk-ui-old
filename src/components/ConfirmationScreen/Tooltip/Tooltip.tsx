import styled from '@emotion/styled/macro';
import { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { Icon, IconNames } from '../Icon/Icon';
import { Text, TextProps, TextKind } from '../Text/Text';

export interface TooltipProps extends TextProps {
  icon?: IconNames;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const IconContainer = styled.a`
  &:hover {
  }
`;

export const Tooltip = ({ id, defaultMessage, icon }: TooltipProps) => {
  const [defaultIcon, setDefaultIcon] = useState<'TooltipHover' | 'Tooltip'>(
    'Tooltip'
  );

  return (
    <Container>
      <IconContainer
        data-tip
        data-for={id}
        onMouseEnter={() => setDefaultIcon('TooltipHover')}
        onMouseLeave={() => setDefaultIcon('Tooltip')}
      >
        <Icon name={icon ? icon : defaultIcon} />
      </IconContainer>
      <ReactTooltip id={id} place="bottom" type="dark" effect="solid">
        <Text id={id} defaultMessage={defaultMessage} kind={TextKind.Tooltip} />
      </ReactTooltip>
    </Container>
  );
};
