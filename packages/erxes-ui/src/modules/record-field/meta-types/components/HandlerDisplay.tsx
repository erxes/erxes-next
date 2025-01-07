import { Button } from 'erxes-ui/components';
import { useRecordTableCellContext } from 'erxes-ui/modules/record-table/record-table-cell/contexts/RecordTableCellContext';
import { Link } from 'react-router-dom';

export default function HandlerDisplay() {
  const { value, row } = useRecordTableCellContext();
  return (
    <Button variant="link" asChild className="px-0">
      <Link to={`/products/${row.original._id}`}>{value}</Link>
    </Button>
  );
}
