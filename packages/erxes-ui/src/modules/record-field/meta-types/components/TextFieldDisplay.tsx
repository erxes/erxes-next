import { useRecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';

export const TextFieldDisplay = () => {
  const { value } = useRecordTableCellContext();
  return <div>{value}</div>;
};
