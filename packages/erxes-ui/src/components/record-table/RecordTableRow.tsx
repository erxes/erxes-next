import { cn } from 'erxes-ui/lib/utils';
import { Table } from '../table';
import { useInView } from 'react-intersection-observer';

export const RecordTableRow = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => {
  const { ref, inView } = useInView({
    threshold: 0,
  });
  return (
    <Table.Row {...props} ref={ref} className={cn('h-8', className)}>
      {inView ? children : null}
    </Table.Row>
  );
};
