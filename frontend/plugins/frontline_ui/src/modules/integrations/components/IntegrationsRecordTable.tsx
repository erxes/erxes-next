import { ColumnDef } from '@tanstack/react-table';
import {
  Badge,
  Button,
  InlineCell,
  InlineCellDisplay,
  RecordTable,
  RecordTableCellDisplay,
} from 'erxes-ui';
import {
  IconArchive,
  IconEdit,
  IconSettings,
  IconTrash,
} from '@tabler/icons-react';
import { IIntegrationDetail } from '../types/Integration';
import { useIntegrations } from '../hooks/useIntegrations';
import { useParams } from 'react-router-dom';
import { BrandsInline } from 'ui-modules/modules';

export const IntegrationsRecordTable = () => {
  const params = useParams();

  const { integrations, loading, handleFetchMore } = useIntegrations({
    variables: {
      kind: params?.integrationType,
    },
    skip: !params?.integrationType,
  });

  return (
    <RecordTable.Provider
      columns={integrationKindColumns}
      data={integrations || []}
      stickyColumns={['name']}
    >
      <RecordTable.CursorProvider
        hasPreviousPage={false}
        hasNextPage={false}
        loading={loading}
        dataLength={integrations?.length}
        sessionKey="integrations_cursor"
      >
        <RecordTable>
          <RecordTable.Header />
          <RecordTable.Body>
            <RecordTable.CursorBackwardSkeleton
              handleFetchMore={handleFetchMore}
            />
            {loading && <RecordTable.RowSkeleton rows={40} />}
            <RecordTable.RowList />
            <RecordTable.CursorForwardSkeleton
              handleFetchMore={handleFetchMore}
            />
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.CursorProvider>
    </RecordTable.Provider>
  );
};

export const integrationKindColumns: ColumnDef<IIntegrationDetail>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTable.InlineHead label="Name" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          {cell.getValue() as string}
        </RecordTableCellDisplay>
      );
    },
    size: 250,
  },
  {
    id: 'brandId',
    accessorKey: 'brandId',
    header: () => <RecordTable.InlineHead label="Brand" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          <BrandsInline brandIds={[cell.getValue() as string]} />
        </RecordTableCellDisplay>
      );
    },
    size: 235,
  },
  {
    id: 'isActive',
    accessorKey: 'isActive',
    header: () => <RecordTable.InlineHead label="Status" />,
    cell: ({ cell }) => {
      const status = cell.getValue() as boolean;
      return (
        <RecordTableCellDisplay>
          <Badge
            className="text-xs capitalize"
            variant={status ? 'success' : 'destructive'}
          >
            {status ? 'Active' : 'Inactive'}
          </Badge>
        </RecordTableCellDisplay>
      );
    },
    size: 100,
  },
  {
    id: 'healthStatus',
    accessorKey: 'healthStatus',
    header: () => <RecordTable.InlineHead label="Health status" />,
    cell: ({ cell }) => {
      const { status } = cell.getValue() as IIntegrationDetail['healthStatus'];

      return (
        <RecordTableCellDisplay>
          <Badge
            className="text-xs capitalize"
            variant={status === 'success' ? 'success' : 'destructive'}
          >
            {status}
          </Badge>
        </RecordTableCellDisplay>
      );
    },
    size: 120,
  },
  {
    id: 'action-group',
    header: () => <RecordTable.InlineHead label="Actions" />,
    cell: () => {
      return (
        <div className="flex items-center justify-center gap-1 [&>button]:px-2">
          <Button variant={'outline'}>
            <IconSettings size={12} />
          </Button>
          <Button variant={'outline'}>
            <IconArchive size={12} />
          </Button>
          <Button variant={'outline'}>
            <IconEdit size={12} />
          </Button>
          <Button
            variant={'outline'}
            className="text-destructive bg-destructive/10"
          >
            <IconTrash size={12} />
          </Button>
        </div>
      );
    },
  },
];
