import { useInView } from 'react-intersection-observer';

import { Table } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib/utils';

export const RecordTableRow = ({
  children,
  className,
  handleRowViewChange,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & {
  handleRowViewChange?: (inView: boolean) => void;
}) => {
  const { ref, inView } = useInView({
    onChange: handleRowViewChange,
  });
  return (
    <Table.Row {...props} ref={ref} className={cn('h-cell', className)}>
      {inView ? children : <Table.Cell className="h-8" />}
    </Table.Row>
  );
};
