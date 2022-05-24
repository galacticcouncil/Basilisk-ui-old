import styled from '@emotion/styled';
import { Text, TextProps, TextVariant } from '../Text/Text';
import { useState } from 'react';
import { Icon } from '../Icon/Icon';

type TableValue = {
  label: TextProps;
  value: TextProps;
  secondValue?: TextProps;
  editable?: boolean;
};

export interface TableProps {
  mainData: TableValue[];
  hiddenData?: TableValue[];
  handleEdit?: () => void;
}

interface RowProps {
  data: TableValue;
  handleEdit?: () => void;
}

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 6px;
`;

const RowContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 0px 8px 0px;
  &:not(:last-child) {
    border-bottom: 1px solid #29292D;
  }
`;

const Label = styled.div`
  margin-right: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px;
  gap: 2px;
`;

const Button = styled('button')({
  border: 'none',
  outline: 'none',
  padding: 0,
  background: 'none',
  userSelect: 'none',
  transition: 'background-color 1s ease-out',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const Edit = styled.div`
  margin-left: 7px;
`;

const Value = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Row = ({ data, handleEdit }: RowProps) => {
  return (
    <RowContainer>
      <Label>
        <Text {...data.label} variant={TextVariant.RowLabel} />
      </Label>
      <Value>
        <Text {...data.value} variant={TextVariant.RowValue} />
        {data.secondValue && (
          <Text {...data.secondValue} variant={TextVariant.RowSecondValue} />
        )}
      </Value>
      {data.editable && (
        <Edit>
          <Button onClick={handleEdit && handleEdit}>
            <Text id="Edit" variant={TextVariant.TableButton} />
          </Button>
        </Edit>
      )}
    </RowContainer>
  );
};

export const Table = ({ mainData, hiddenData, handleEdit }: TableProps) => {
  const [showHidden, setShowHidden] = useState(false);

  return (
    <TableContainer>
      {mainData.map((item) => (
        <Row data={item} handleEdit={handleEdit} />
      ))}
      {showHidden &&
        hiddenData &&
        hiddenData.map((item) => <Row data={item} handleEdit={handleEdit} />)}
      <div>
        <ButtonContainer>
          <Button onClick={() => setShowHidden(!showHidden)}>
            <Text
              id={'Advanced settings'}
              variant={TextVariant.TableButton}
            ></Text>
            <Icon name={showHidden ? 'ArrowUp' : 'ArrowDown'} size={14} />
          </Button>
        </ButtonContainer>
      </div>
    </TableContainer>
  );
};
