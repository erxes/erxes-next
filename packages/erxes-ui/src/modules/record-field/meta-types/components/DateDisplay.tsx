import { RelativeDateDisplay } from 'erxes-ui/components/display/relativeDateDisplay';
import { useRecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';

export const DateDisplay = () => {
  const { value } = useRecordTableCellContext();
  return <RelativeDateDisplay value={value} />;
};

