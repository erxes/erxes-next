import { IconHash, IconLabel, IconLabelFilled } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import {
  RecordTable,
  RecordTableCellContent,
  RecordTableCellDisplay,
  RecordTableCellTrigger,
  RecordTableTree,
} from 'erxes-ui/modules';
import { useMemo } from 'react';
import { contractTypes_PER_PAGE } from '~/modules/contractTypes/hooks/addContractType';
import { useContractTypes } from '~/modules/contractTypes/hooks/useContractTypes';
import { IContractType } from '~/modules/contractTypes/types';
import { RecordTablePopover } from 'erxes-ui/modules';
import { ContractTypeMoreColumn } from '~/modules/contractTypes/components/ContractTypeMoreColumn';
import { Input } from 'react-aria-components';
import { TextOverflowTooltip } from 'erxes-ui/components';

export const ContractTypesRecordTable = () => {
  const { contractTypes, loading } = useContractTypes();

  //   const types = contractTypes?.map((category: IContractType) => ({
  //     ...category,
  //   }));

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
              {loading && (
                <RecordTable.RowSkeleton rows={contractTypes_PER_PAGE} />
              )}
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.Scroll>
      </RecordTableTree>
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
