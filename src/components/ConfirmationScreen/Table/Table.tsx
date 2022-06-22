import styled from '@emotion/styled/macro';
import { Text, TextProps } from '../Text/Text';
import { TextKind } from '../Text/TextTheme';
import { useState } from 'react';
import { Icon } from '../Icon/Icon';
import { useFormContext } from 'react-hook-form';

type TableValue = {
  label: TextProps;
  valueSuffix?: string;
  valuePrefix?: string;
  secondValueSuffix?: string;
  secondValuePrefix?: string;
  editable?: boolean;
};

export interface TableProps {
  settings: TableValue[];
  advancedSettings?: TableValue[];
  noEdit?: boolean;
  handleEdit?: () => void;
}

interface RowProps {
  data: TableValue;
  handleEdit?: () => void;
  noEdit?: boolean;
}

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 6px;

  background: #211f24;
`;

const RowContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 0px 8px 0px;
  &:not(:last-child) {
    border-bottom: 1px solid #29292d;
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

const Row = ({ data, handleEdit, noEdit }: RowProps) => {
  const methods = useFormContext();

  return (
    <RowContainer>
      <Label>
        <Text {...data.label} kind={TextKind.RowLabel} />
      </Label>
      <Value>
        {methods.getValues(`${data.label.id}.value`) && (
          <Text
            id={`${data.valuePrefix || ''}${methods.getValues(
              `${data.label.id}.value`
            )}${data.valueSuffix || ''}`}
            kind={TextKind.RowValue}
          />
        )}
        {methods.getValues(`${data.label.id}.secondValue`) && (
          <Text
            id={`${data.secondValuePrefix || ''}${methods.getValues(
              `${data.label.id}.secondValue`
            )}${data.secondValueSuffix || ''}`}
            kind={TextKind.RowSecondValue}
          />
        )}
      </Value>
      {!noEdit && data.editable && (
        <Edit>
          <Button onClick={handleEdit && handleEdit}>
            <Text
              id="edit"
              defaultMessage={'Edit'}
              kind={TextKind.TableButton}
            />
          </Button>
        </Edit>
      )}
    </RowContainer>
  );
};

export const Table = ({
  settings,
  advancedSettings,
  handleEdit,
  noEdit = false,
}: TableProps) => {
  const [showHidden, setShowHidden] = useState(false);

  return (
    <TableContainer>
      {settings.map((item) => (
        <Row
          data={item}
          handleEdit={handleEdit}
          noEdit={noEdit}
        />
      ))}
      {showHidden &&
        advancedSettings &&
        advancedSettings.map((item) => (
          <Row
            data={item}
            handleEdit={handleEdit}
            noEdit={noEdit}
          />
        ))}
      {advancedSettings && (
        <div>
          <ButtonContainer>
            <Button onClick={() => setShowHidden(!showHidden)}>
              <Text id={'Advanced settings'} kind={TextKind.TableButton}></Text>
              <Icon name={showHidden ? 'ArrowUp' : 'ArrowDown'} size={14} />
            </Button>
          </ButtonContainer>
        </div>
      )}
    </TableContainer>
  );
};
