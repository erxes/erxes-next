import { cn } from 'erxes-ui/lib/utils';
import { Table } from 'erxes-ui/components';
import { useInView } from 'react-intersection-observer';
import { useRecordTable } from './RecordTableProvider';

export const RecordTableRow = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => {
  const { ref, inView } = useInView();
  const { table } = useRecordTable();
  const columnCount = table.getRowModel().rows[0]?.getVisibleCells().length;
  return (
    <Table.Row {...props} ref={ref} className={cn('h-8', className)}>
      {inView ? children : <Table.Cell className="h-8" colSpan={columnCount} />}
    </Table.Row>
  );
};
