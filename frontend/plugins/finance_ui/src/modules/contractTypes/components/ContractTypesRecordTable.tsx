import { IconLabel } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import {
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTablePopover,
  RecordTableTree,
  useSetQueryStateByKey,
} from 'erxes-ui';
import { useMemo } from 'react';
import { useContractTypes } from '@/contractTypes/hooks/useContractTypes';
import { IContractType } from '@/contractTypes/types';
import { Badge, TextOverflowTooltip, Input } from 'erxes-ui';
import { ContractTypeCommandBar } from '@/contractTypes/components/ContractTypeCommandBar';

export const ContractTypesRecordTable = () => {
  const { contractTypes, loading } = useContractTypes();

  const contractTypeObject = useMemo(() => {
    return contractTypes?.reduce(
      (acc: Record<string, IContractType>, type: IContractType) => {
        acc[type._id] = type;
        return acc;
      },
      {},
    );
  }, [contractTypes]);

  return (
    <RecordTable.Provider
      columns={contractTypeColumns}
      data={contractTypes || []}
      className="m-3"
    >
      <RecordTableTree id="contractTypes" ordered>
        <RecordTable.Scroll>
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.RowList Row={RecordTableTree.Row} />
              {loading && <RecordTable.RowSkeleton rows={40} />}
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.Scroll>
      </RecordTableTree>
      <ContractTypeCommandBar />
    </RecordTable.Provider>
  );
};

export const contractTypeColumns: ColumnDef<IContractType>[] = [
  // ContractTypeMoreColumn,
  RecordTable.checkboxColumn as ColumnDef<IContractType>,
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTable.InlineHead icon={IconLabel} label="Name" />,
    cell: ({ cell }) => {
      const name = cell.getValue() as string;
      const setQuery = useSetQueryStateByKey();

      const setOpen = (contractTypeId: string) => {
        setQuery('contractTypeId', contractTypeId);
      };

      return (
        <RecordTablePopover>
          <RecordTableCellTrigger>
            <Badge
              variant={'secondary'}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(cell.row.original._id);
              }}
            >
              {name}
            </Badge>
          </RecordTableCellTrigger>
          <RecordTableCellContent className="min-w-72">
            <Input value={name || ''} />
          </RecordTableCellContent>
        </RecordTablePopover>
      );
    },
    size: 250,
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: () => <RecordTable.InlineHead icon={IconLabel} label="Code" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'number',
    accessorKey: 'number',
    header: () => (
      <RecordTable.InlineHead icon={IconLabel} label="Start Number" />
    ),
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableCellDisplay>
      );
    },
  },
  {
    id: 'vacancy',
    accessorKey: 'vacancy',
    header: () => <RecordTable.InlineHead icon={IconLabel} label="Vacancy" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableCellDisplay>
      );
    },
  },
];
