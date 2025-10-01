import useRemoveToken from '@/settings/apps/hooks/useRemoveToken';
import { IApp } from '@/settings/apps/types';
import { IconCopy, IconTrash } from '@tabler/icons-react';
import { Cell, ColumnDef } from '@tanstack/table-core';
import { format } from 'date-fns';
import { Button, RecordTableInlineCell, toast, useConfirm } from 'erxes-ui';

const RemoveButton = ({ cell }: { cell: Cell<IApp, unknown> }) => {
  const { _id, name } = cell.row.original;
  const { appsRemove } = useRemoveToken();
  const { confirm } = useConfirm();
  const confirmOptions = { confirmationValue: 'delete' };

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={`Remove ${name}`}
      title="Remove app"
      onClick={() =>
        void confirm({
          message: `Are you sure you want to remove the app '${name}'`,
          options: confirmOptions,
        }).then(() =>
          appsRemove({
            variables: { _id },
            onCompleted: () => {
              toast({
                title: `App '${name}' removed`,
              });
            },
            onError: (e) => {
              toast({
                title: 'Error',
                description: e.message,
                variant: 'destructive',
              });
            },
          }),
        )
      }
    >
      <IconTrash />
    </Button>
  );
};

const CopyTokenButton = ({ cell }: { cell: Cell<IApp, unknown> }) => {
  const { accessToken } = cell.row.original;
  async function copy() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(accessToken);
        toast({
          title: 'Token copied to clipboard',
        });
      } catch {
        toast({
          title: 'Failed to copy token',
          variant: 'destructive',
        });
      }
    }
  }
  return (
    <Button variant="outline" size="icon" onClick={copy}>
      <IconCopy />
    </Button>
  );
};

export const appsSettingsColumns: ColumnDef<IApp>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'App Name',
    cell: ({ cell }) => {
      const { name } = cell.row.original;
      return <RecordTableInlineCell>{name ?? ''}</RecordTableInlineCell>;
    },
    size: 250,
  },
  {
    id: 'expireDate',
    accessorKey: 'expireDate',
    header: 'Expiration',
    cell: ({ cell }) => {
      const { expireDate } = cell.row.original;
      return (
        <RecordTableInlineCell>
          {format(expireDate, 'yyyy-MM-dd')}
        </RecordTableInlineCell>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ cell }) => {
      return (
        <RecordTableInlineCell className="flex justify-center gap-2">
          <RemoveButton cell={cell} />
          <CopyTokenButton cell={cell} />
        </RecordTableInlineCell>
      );
    },
    size: 100,
  },
];
