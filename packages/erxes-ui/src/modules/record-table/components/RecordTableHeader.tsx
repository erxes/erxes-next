import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { Table } from 'erxes-ui/components';
import { useRecordTable } from './RecordTableProvider';
import { Header } from '@tanstack/react-table';

export const RecordTableHeader = ({
  renderHead,
}: {
  renderHead: (header: Header<any, unknown>, idx: number) => JSX.Element;
}) => {
  const { table } = useRecordTable();
  return (
    <Table.Header>
      {table.getHeaderGroups().map((headerGroup) => (
        <Table.Row key={headerGroup.id}>
          <SortableContext
            items={table.getState().columnOrder}
            strategy={horizontalListSortingStrategy}
          >
            {headerGroup.headers.map(renderHead)}
          </SortableContext>
        </Table.Row>
      ))}
    </Table.Header>
  );
};
