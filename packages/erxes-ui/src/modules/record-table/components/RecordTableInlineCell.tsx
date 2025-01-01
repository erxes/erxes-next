import { useState } from 'react';
import { RecordTableInlineCellDisplay } from './RecordTableInlineCellDisplay';
import { RecordTableInlineCellEdit } from './RecordTableInlineCellEdit';

const RecordTableInlineCell = ({
  value,
  type,
  readOnly,
  onValueChange,
}: {
  value: any;
  type: string;
  readOnly: boolean;
  onValueChange: (value: any) => void;
}) => {
  const [isInEditMode, setIsInEditMode] = useState(false);

  return readOnly || !isInEditMode ? (
    <RecordTableInlineCellDisplay value={value} type={type} />
  ) : (
    <RecordTableInlineCellEdit
      value={value}
      type={type}
      onValueChange={onValueChange}
    />
  );
};

export default RecordTableInlineCell;
