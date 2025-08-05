import { Cell, ColumnDef } from '@tanstack/table-core';
import { IUnitListItem } from '../../types/unit';
import { IconEdit, IconHash, IconTrash } from '@tabler/icons-react';
import {
  Badge,
  Button,
  Input,
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
  Spinner,
  TextOverflowTooltip,
  useConfirm,
  useQueryState,
} from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { renderingUnitDetailAtom } from '../../states/renderingUnitDetail';
import { SelectDepartments, SelectMember } from 'ui-modules';
import { useRemoveUnit, useUnitInlineEdit } from '../../hooks/useUnitActions';
import { useState } from 'react';

export const UnitEditColumnCell = ({
  cell,
}: {
  cell: Cell<IUnitListItem, unknown>;
}) => {
  const [, setOpen] = useQueryState('unit_id');
  const setRenderingCustomerDetail = useSetAtom(renderingUnitDetailAtom);
  const { _id } = cell.row.original;
  return (
    <Button
      onClick={() => {
        setOpen(_id);
        setRenderingCustomerDetail(false);
      }}
      variant={'outline'}
    >
      <IconEdit size={12} />
    </Button>
  );
};

export const UnitRemoveCell = ({
  cell,
}: {
  cell: Cell<IUnitListItem, unknown>;
}) => {
  const { confirm } = useConfirm();
  const { _id, title } = cell.row.original;
  const { handleRemove, loading } = useRemoveUnit();
  const onRemove = () => {
    confirm({
      message: `Are you sure you want to remove '${title}'`,
      options: { confirmationValue: 'delete' },
    }).then(() =>
      handleRemove({
        variables: {
          ids: [_id],
        },
      }),
    );
  };
  return (
    <Button
      variant={'outline'}
      disabled={loading}
      onClick={onRemove}
      className="text-destructive bg-destructive/10"
    >
      {loading ? <Spinner /> : <IconTrash size={12} />}
    </Button>
  );
};

export const UnitsColumns: ColumnDef<IUnitListItem>[] = [
  RecordTable.checkboxColumn as ColumnDef<IUnitListItem>,
  {
    id: 'code',
    accessorKey: 'code',
    header: () => <RecordTable.InlineHead icon={IconHash} label="code" />,
    cell: ({ cell }) => {
      const { unitsEdit, loading } = useUnitInlineEdit();
      const { _id, code } = cell.row.original;
      const [open, setOpen] = useState<boolean>(false);
      const [_code, setCode] = useState<string>(code || '');

      const onSave = () => {
        if (_code !== code) {
          unitsEdit(
            {
              variables: {
                id: _id,
                code: _code,
              },
            },
            ['code'],
          );
        }
      };

      const onChange = (el: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = el.currentTarget;
        setCode(value);
      };

      return (
        <RecordTablePopover
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            if (!open) {
              onSave();
            }
          }}
        >
          <RecordTableCellTrigger>
            {cell.getValue() as string}
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={_code} onChange={onChange} disabled={loading} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: () => <RecordTable.InlineHead label="title" />,
    cell: ({ cell }) => {
      const { unitsEdit, loading } = useUnitInlineEdit();
      const { _id, title, code } = cell.row.original;
      const [open, setOpen] = useState<boolean>(false);
      const [_title, setTitle] = useState<string>(title || '');
      const onSave = () => {
        if (_title !== title) {
          unitsEdit(
            {
              variables: {
                id: _id,
                title: _title,
                code: code,
              },
            },
            ['title', 'code'],
          );
        }
      };
      const onChange = (el: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = el.currentTarget;
        setTitle(value);
      };
      return (
        <RecordTablePopover
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            if (!open) {
              onSave();
            }
          }}
        >
          <RecordTableCellTrigger>
            <TextOverflowTooltip value={cell.getValue() as string} />
          </RecordTableCellTrigger>
          <RecordTableCellContent>
            <Input value={_title} onChange={onChange} disabled={loading} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
    size: 300,
  },
  {
    id: 'supervisorId',
    accessorKey: 'supervisorId',
    header: () => <RecordTable.InlineHead label="supervisor" />,
    cell: ({ cell }) => {
      const { _id, code } = cell.row.original;
      const { unitsEdit } = useUnitInlineEdit();
      return (
        <RecordTableCellDisplay>
          <SelectMember.InlineCell
            mode="single"
            value={cell.getValue() as string}
            onValueChange={(value) => {
              unitsEdit(
                {
                  variables: {
                    id: _id,
                    supervisorId: value,
                    code,
                  },
                },
                ['supervisorId', 'code'],
              );
            }}
            scope={`UnitsPage.${_id}.Supervisor`}
          />
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'departmentId',
    accessorKey: 'departmentId',
    header: () => <RecordTable.InlineHead label="department" />,
    cell: ({ cell }) => {
      const { _id, code } = cell.row.original;
      const { unitsEdit } = useUnitInlineEdit();
      return (
        <SelectDepartments.InlineCell
          mode="single"
          value={cell.getValue() as string}
          onValueChange={(value) => {
            unitsEdit(
              {
                variables: {
                  id: _id,
                  departmentId: value,
                  code,
                },
              },
              ['departmentId', 'code'],
            );
          }}
        />
      );
    },
  },
  {
    id: 'userCount',
    accessorKey: 'userCount',
    header: () => <RecordTable.InlineHead label="team member count" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay className="justify-center">
          <Badge variant={'secondary'}>{cell.getValue() as number}</Badge>
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'action-group',
    header: () => <RecordTable.InlineHead label="Actions" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay className="justify-center gap-1 [&>button]:px-2">
          <UnitEditColumnCell cell={cell} />
          <UnitRemoveCell cell={cell} />
        </RecordTableCellDisplay>
      );
    },
  },
];
