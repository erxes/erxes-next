import { IconLabel } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import { RecordTable, RecordTableCellDisplay, RecordTableTree } from 'erxes-ui';
import { useMemo } from 'react';
import { useContractTypes } from '~/modules/contractTypes/hooks/useContractTypes';
import { IContractType } from '~/modules/contractTypes/types';
import { ContractTypeMoreColumn } from '~/modules/contractTypes/components/ContractTypeMoreColumn';
import { TextOverflowTooltip } from 'erxes-ui/components';
import { ContractTypeCommandBar } from '~/modules/contractTypes/components/ContractTypeCommandBar';

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
      columns={contractTypeColumns(contractTypeObject)}
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

export const contractTypeColumns: (
  contractTypeObject: Record<string, IContractType>,
) => ColumnDef<IContractType>[] = (contractTypeObject) => [
  ContractTypeMoreColumn,
  RecordTable.checkboxColumn as ColumnDef<IContractType>,
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTable.InlineHead icon={IconLabel} label="Name" />,
    cell: ({ cell }) => {
      return (
        <RecordTableCellDisplay>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableCellDisplay>
      );
    },
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
