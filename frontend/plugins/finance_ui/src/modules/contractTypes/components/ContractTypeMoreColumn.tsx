import { CellContext } from '@tanstack/react-table';
import { useSetAtom } from 'jotai';
import { useSearchParams } from 'react-router-dom';
import { RecordTable } from 'erxes-ui';
import { IContractType } from '~/modules/contractTypes/types';
import { atom } from 'jotai';

export const renderingContractTypeDetailAtom = atom(false);

export const ContractTypeMoreColumnCell = (
  props: CellContext<IContractType, unknown>,
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const setRenderingContractTypeDetail = useSetAtom(
    renderingContractTypeDetailAtom,
  );
  const { _id } = props.row.original;

  const setOpen = (contractTypeId: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('contractType_id', contractTypeId);
    setSearchParams(newSearchParams);
  };

  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
        setRenderingContractTypeDetail(false);
      }}
    />
  );
};

export const ContractTypeMoreColumn = {
  id: 'more',
  cell: ContractTypeMoreColumnCell,
  size: 33,
} as const;
