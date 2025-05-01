import { useInView } from 'react-intersection-observer';

import { Table } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib/utils';

export const RecordTableRow = ({
  children,
  className,
  handleRowViewChange,
  id,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & {
  handleRowViewChange?: (inView: boolean) => void;
  id?: string;
}) => {
  const { ref, inView } = useInView({
    onChange: handleRowViewChange,
  });
  return (
    <Table.Row
      {...props}
      ref={ref}
      className={cn('h-cell', inView ? 'in-view' : 'out-of-view', className)}
      id={id}
    >
      {children}
    </Table.Row>
  );
};
