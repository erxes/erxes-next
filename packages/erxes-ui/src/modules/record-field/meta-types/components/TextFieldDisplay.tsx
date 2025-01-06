import { useRecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';

export const TextFieldDisplay = () => {
  const { getValue } = useRecordTableCellContext();
  const value = getValue();
  return <div>{value}</div>;
};
