import { useState } from 'react';
import { RecordTableInlineCellEdit } from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCellEdit';
import { CellContext } from '@tanstack/react-table';
import { RecordTableCellContainer } from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableCellContainer';
import { RecordTableCellDisplayContainer } from './RecordTableCellDisplayContainer';
import { FieldDisplay } from 'erxes-ui/modules/record-field/components/FieldDisplay';
import { RecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';
import { FieldInput } from 'erxes-ui/modules/record-field/components/FieldInput';
import { useRecordTable } from 'erxes-ui/modules/record-table/components/RecordTableProvider';

const RecordTableInlineCell = ({
  type,
  readOnly,
  ...info
}: {
  readOnly?: boolean;
  type: string;
} & CellContext<any, any>) => {
  const { useMutateValueHook } = useRecordTable();
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [value, setValue] = useState<any>(info.getValue());
  const { mutate, loading } = useMutateValueHook(info.column.id)();

  const handleSave = (savedValue: any) => {
    setIsInEditMode(false);
    if (savedValue === info.getValue()) {
      return;
    }

    mutate({
      _id: info.row.original._id,
      [info.column.id]: value,
    });
  };

  const onSubmit = () => handleSave(value);

  const onSelect = (value: string) => handleSave(value);

  return (
    <RecordTableCellContext.Provider
      value={{
        ...info,
        isInEditMode: readOnly ? false : isInEditMode,
        setIsInEditMode,
        value,
        setValue,
        onSubmit,
        onSelect,
      }}
    >
      <RecordTableCellContainer>
        {readOnly || !isInEditMode ? (
          <RecordTableCellDisplayContainer
            onClick={() => setIsInEditMode(true)}
          >
            <FieldDisplay type={type} />
          </RecordTableCellDisplayContainer>
        ) : (
          <RecordTableInlineCellEdit>
            <FieldInput type={type} />
          </RecordTableInlineCellEdit>
        )}
      </RecordTableCellContainer>
    </RecordTableCellContext.Provider>
  );
};

export default RecordTableInlineCell;
