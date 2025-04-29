import React from 'react';
import { useParams } from 'react-router-dom';
import { Cell, ColumnDef } from '@tanstack/table-core';
import { useIntegrations } from '../hooks/useIntegrations';
import { IBrand, IIntegrationColumnDef } from '../types/integration';
import { Badge, Button, RecordTable, Table } from 'erxes-ui';
import {
  IconArchive,
  IconEdit,
  IconSettings,
  IconTrash,
} from '@tabler/icons-react';

const INTEGRATION_PER_PAGE = 30;

export const IntegrationsList = () => {
  const params = useParams();
  const { integrations, loading } = useIntegrations({
    variables: {
      page: 1,
      perPage: INTEGRATION_PER_PAGE,
      kind: params?.kind,
    },
    skip: !params?.kind,
  });
  return (
    <RecordTable.Provider
      columns={integrationKindColumns}
      data={integrations || []}
    >
      <RecordTable>
        .
        <RecordTable.Header />
        <RecordTable.Body />
      </RecordTable>
    </RecordTable.Provider>
  );
};

export const integrationKindColumns: ColumnDef<IIntegrationColumnDef>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTable.InlineHead label="Name" />,
    cell: ({ cell }) => {
      return <div>{cell.getValue() as string}</div>;
    },
    size: 250,
  },
  {
    id: 'kind',
    accessorKey: 'kind',
    header: () => <RecordTable.InlineHead label="Kind" />,
    cell: ({ cell }) => {
      return (
        <div className="px-2 py-1 flex items-center justify-center">
          <Badge variant={'secondary'} className="text-xs">
            {cell.getValue() as string}
          </Badge>
        </div>
      );
    },
    size: 250,
  },
  {
    id: 'brand',
    accessorKey: 'brand',
    header: () => <RecordTable.InlineHead label="Brand" />,
    cell: ({ cell }) => {
      const { name } = cell.getValue() as IBrand;
      return <div>{name}</div>;
    },
    size: 250,
  },
  {
    id: 'isActive',
    accessorKey: 'isActive',
    header: () => <RecordTable.InlineHead label="Status" />,
    cell: ({ cell }) => {
      const status = cell.getValue() as boolean;
      if (status) {
        return (
          <div className="px-2 py-1 flex items-center justify-center">
            <Badge className="text-xs" colorSeed="#0596691A">
              {'Active'}
            </Badge>
          </div>
        );
      } else
        return (
          <div className="px-2 py-1 flex items-center justify-center">
            <Badge className="text-xs" variant={'destructive'}>
              {'Inactive'}
            </Badge>
          </div>
        );
    },
    size: 250,
  },
  {
    id: 'healthStatus',
    accessorKey: 'healthStatus',
    header: () => <RecordTable.InlineHead label="Health status" />,
    cell: ({ cell }) => {
      const { status } =
        cell.getValue() as IIntegrationColumnDef['healthStatus'];

      if (status === 'healthy') {
        return (
          <div className="px-2 py-1">
            <Badge className="text-xs" colorSeed="hsl(158, 94%, 31%)">
              {'Healthy'}
            </Badge>
          </div>
        );
      } else
        return (
          <div className="px-2 py-1">
            <Badge className="text-xs" variant={'destructive'}>
              {'Unhealthy'}
            </Badge>
          </div>
        );
    },
    size: 250,
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
          <Button variant={'outline'} className='text-destructive bg-destructive/10'>
            <IconTrash size={12} />
          </Button>
        </div>
      );
    },
  },
];
