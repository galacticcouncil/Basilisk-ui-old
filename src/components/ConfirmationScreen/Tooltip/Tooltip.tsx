import styled from '@emotion/styled/macro';
import ReactTooltip from 'react-tooltip';
import { Icon } from '../Icon/Icon';
import { Text, TextProps, TextKind } from '../Text/Text';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const IconContainer = styled.a`
  &:hover {
  }
`;

export const Tooltip = (tooltip: TextProps) => {
  return (
    <Container>
      <IconContainer data-tip data-for={tooltip.id}>
        <Icon name="Tooltip" />
      </IconContainer>
      <ReactTooltip id={tooltip.id} place="bottom" type="dark" effect="solid">
        <Text {...tooltip} kind={TextKind.Tooltip} />
      </ReactTooltip>
    </Container>
  );
};
