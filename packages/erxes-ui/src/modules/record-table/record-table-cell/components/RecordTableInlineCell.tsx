import { useState } from 'react';
import { RecordTableInlineCellEdit } from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCellEdit';
import { CellContext } from '@tanstack/react-table';
import { RecordTableCellContainer } from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableCellContainer';
import { RecordTableCellDisplayContainer } from './RecordTableCellDisplayContainer';
import { FieldDisplay } from 'erxes-ui/modules/record-field/components/FieldDisplay';
import { RecordTableCellContext } from '../contexts/RecordTableCellContext';
import { FieldInput } from 'erxes-ui/modules/record-field/components/FieldInput';

const RecordTableInlineCell = ({
  type,
  readOnly,
  ...info
}: {
  readOnly?: boolean;
  type: string;
} & CellContext<any, any>) => {
  const [isInEditMode, setIsInEditMode] = useState(false);

  return (
    <RecordTableCellContext.Provider
      value={{
        ...info,
        isInEditMode,
        setIsInEditMode,
      }}
    >
      <RecordTableCellContainer onClick={() => setIsInEditMode(true)}>
        {readOnly || !isInEditMode ? (
          <RecordTableCellDisplayContainer>
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
