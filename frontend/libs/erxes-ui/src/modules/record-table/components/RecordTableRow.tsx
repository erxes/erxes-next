import { useInView } from 'react-intersection-observer';

import { Table } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib/utils';

export const RecordTableRow = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => {
  const { ref, inView } = useInView();
  return (
    <Table.Row {...props} ref={ref} className={cn('h-8', className)}>
      {inView ? children : <Table.Cell className="h-8" />}
    </Table.Row>
  );
};
