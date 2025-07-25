import { CellContext } from '@tanstack/react-table';
import { RecordTable, useSetQueryStateByKey } from 'erxes-ui';
import { IContractType } from '~/modules/contractTypes/types';
import { atom } from 'jotai';

export const ContractTypeMoreColumnCell = (
  props: CellContext<IContractType, unknown>,
) => {
  const { _id } = props.row.original;
  const setQuery = useSetQueryStateByKey();

  const setOpen = (contractTypeId: string) => {
    setQuery('contractTypeId', contractTypeId);
  };

  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
      }}
    />
  );
};

export const ContractTypeMoreColumn = {
  id: 'more',
  cell: ContractTypeMoreColumnCell,
  size: 33,
} as const;
