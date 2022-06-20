import styled from '@emotion/styled/macro';
import { Text, TextProps, TextKind } from '../../ConfirmationScreen/Text/Text';
import { useState } from 'react';
import { Icon, IconNames } from '../../ConfirmationScreen/Icon/Icon';

export type DropdownItem = {
  icon: IconNames;
  label: TextProps;
  onClick: () => void;
};

export interface DropdownProps {
  items: DropdownItem[];
}

interface DropdownButtonProps {
  handleClick: () => void;
  show: boolean;
}

const DropdownContainer = styled.div`
  position: relative;
  width: 34px;
  height: 34px;
`;

const DropdownActions = styled.div`
  position: absolute;
  top: 39px;
  right: 0px;
  display: inline-block;
  box-shadow: 0px 40px 70px rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(40px);
  border-radius: 12px;
  z-index: 1000;
`;

const DropdownItemContainer = styled.div`
  padding: 18px 22px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 11px;
  user-select: none;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  &:first-child {
    border-radius: 12px 12px 0px 0px;
  }

  &:last-child {
    border-radius: 0px 0px 12px 12px;
  }

  &:hover {
    background: rgba(76, 243, 168, 0.12);
  }
`;

const TextContainer = styled.div`
  min-width: 200px;
`;

const Button = styled.button<{ pressed: boolean }>`
  width: 34px;
  height: 34px;
  background: ${(props) =>
    props.pressed ? 'rgba(76, 243, 168, 0.12)' : 'rgba(255, 255, 255, 0.06)'};
  border-radius: 100%;
  border: 0px;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: rgba(76, 243, 168, 0.12);
  }
`;

const IconContainer = styled.div`
  width: 25px;
  height: 25px;
`;

const DropdownButton = ({ handleClick, show }: DropdownButtonProps) => {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      pressed={show}
    >
      <IconContainer>
        <Icon name={'ThreeDots'} />
      </IconContainer>
    </Button>
  );
};

export const Dropdown = ({ items }: DropdownProps) => {
  const [show, setShow] = useState(false);

  return (
    <DropdownContainer>
      <DropdownButton handleClick={() => setShow(!show)} show={show} />
      {show && (
        <DropdownActions>
          {items.map((item) => {
            return (
              <DropdownItemContainer
                key={item.label.id}
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick();
                }}
              >
                <Icon name={item.icon} size={18} />
                <TextContainer>
                  <Text {...item.label} kind={TextKind.AssetDropdown} />
                </TextContainer>
              </DropdownItemContainer>
            );
          })}
        </DropdownActions>
      )}
    </DropdownContainer>
  );
};
