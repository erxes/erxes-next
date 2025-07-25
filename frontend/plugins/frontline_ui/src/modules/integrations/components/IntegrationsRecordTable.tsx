import { Cell, ColumnDef } from '@tanstack/react-table';
import {
  Badge,
  Input,
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
} from 'erxes-ui';
import { IIntegrationDetail } from '../types/Integration';
import { useIntegrations } from '../hooks/useIntegrations';
import { useParams } from 'react-router-dom';
import { BrandsInline } from 'ui-modules';
import { useIntegrationEditField } from '@/integrations/hooks/useIntegrationEdit';
import { useState } from 'react';
import { InboxHotkeyScope } from '@/inbox/types/InboxHotkeyScope';
import { ArchiveIntegration } from '@/integrations/components/ArchiveIntegration';
import { RemoveIntegration } from '@/integrations/components/RemoveIntegration';

export const IntegrationsRecordTable = ({
  Actions,
}: {
  Actions: (props: {
    cell: Cell<IIntegrationDetail, unknown>;
  }) => React.ReactNode;
}) => {
  const params = useParams();

  const { integrations, loading, handleFetchMore } = useIntegrations({
    variables: {
      kind: params?.integrationType,
    },
    skip: !params?.integrationType,
    errorPolicy: 'all',
  });

  return (
    <RecordTable.Provider
      columns={integrationTypeColumns({ Actions })}
      data={(integrations || []).filter((integration) => integration)}
      stickyColumns={['name']}
    >
      <RecordTable.Scroll>
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
      </RecordTable.Scroll>
    </RecordTable.Provider>
  );
};

const NameField = ({ cell }: { cell: Cell<IIntegrationDetail, unknown> }) => {
  const [name, setName] = useState(cell.row.original.name);
  const { editIntegrationField } = useIntegrationEditField(cell.row.original);

  const handleSave = () => {
    editIntegrationField(
      {
        variables: {
          name,
        },
      },
      cell.row.original.name === name,
    );
  };

  return (
    <RecordTablePopover
      onOpenChange={(open) => {
        if (!open) {
          handleSave();
        }
      }}
      scope={`${InboxHotkeyScope.IntegrationSettingsPage}_${cell.row.original._id}_name`}
      closeOnEnter
    >
      <RecordTableCellTrigger>{name}</RecordTableCellTrigger>
      <RecordTableCellContent>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </RecordTableCellContent>
    </RecordTablePopover>
  );
};

export const BrandField = ({
  cell,
}: {
  cell: Cell<IIntegrationDetail, unknown>;
}) => {
  return <></>;
};

export const integrationTypeColumns = ({
  Actions,
}: {
  Actions: (props: {
    cell: Cell<IIntegrationDetail, unknown>;
  }) => React.ReactNode;
}): ColumnDef<IIntegrationDetail>[] => [
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTable.InlineHead label="Name" />,
    cell: ({ cell }) => <NameField cell={cell} />,
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
            variant={status === 'healthy' ? 'success' : 'destructive'}
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
    cell: ({ cell }) => {
      return (
        <div className="flex items-center justify-center gap-1.5">
          <Actions cell={cell} />
          <ArchiveIntegration
            _id={cell.row.original._id}
            name={cell.row.original.name}
          />
          <RemoveIntegration
            _id={cell.row.original._id}
            name={cell.row.original.name}
          />
        </div>
      );
    },
    size: 120,
  },
];
