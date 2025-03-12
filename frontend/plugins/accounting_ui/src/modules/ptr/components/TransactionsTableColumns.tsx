import { Cell, ColumnDef } from '@tanstack/react-table';
import { ITransaction } from '../types/Transaction';
import {
  useQueryState,
  RecordTable,
  InlineCell,
  InlineCellDisplay,
  InlineCellEdit,
  Input,
  RelativeDateDisplay,
  CurrencyDisplay,
  CurrencyCode,
  CurrencyInput,
} from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { renderingTransactionDetailState } from '../states/renderingTransactionContactingDetailStates';
import { IconMoneybag, IconFile, IconCalendar } from '@tabler/icons-react';
import { useState } from 'react';

export const transactionColumns: ColumnDef<ITransaction>[] = [
  {
    id: 'account',
    header: () => (
      <RecordTable.InlineHead icon={IconMoneybag} label="Account" />
    ),
    accessorKey: 'details',
    cell: ({
      row: {
        original: { details, _id },
      },
    }) => (
      <InlineCell
        name="account"
        recordId={_id || ''}
        display={() => (
          <InlineCellDisplay>
            {details.length &&
              `${details[0].account?.code} - ${details[0].account?.name}`}
          </InlineCellDisplay>
        )}
      />
    ),
  },
  {
    id: 'number',
    header: () => <RecordTable.InlineHead icon={IconFile} label="Number" />,
    accessorKey: 'number',
    cell: ({
      getValue,
      row: {
        original: { _id },
      },
    }) => {
      const [number, setNumber] = useState(getValue() as string);
      return (
        <InlineCell
          name="number"
          recordId={_id || ''}
          display={() => (
            <InlineCellDisplay>{getValue() as string}</InlineCellDisplay>
          )}
          edit={() => (
            <InlineCellEdit>
              <Input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full"
              />
            </InlineCellEdit>
          )}
        />
      );
    },
  },
  {
    id: 'date',
    header: () => <RecordTable.InlineHead icon={IconCalendar} label="Date" />,
    accessorKey: 'date',
    cell: ({
      getValue,
      row: {
        original: { _id },
      },
    }) => {
      return (
        <InlineCell
          name="date"
          recordId={_id || ''}
          display={() => (
            <InlineCellDisplay>
              <RelativeDateDisplay value={getValue() as string} />
            </InlineCellDisplay>
          )}
        />
      );
    },
  },

  {
    id: 'description',
    header: () => (
      <RecordTable.InlineHead icon={IconFile} label="Description" />
    ),
    accessorKey: 'description',
    cell: ({
      getValue,
      row: {
        original: { _id },
      },
    }) => {
      const [description, setDescription] = useState(getValue() as string);
      return (
        <InlineCell
          name="description"
          recordId={_id || ''}
          display={() => (
            <InlineCellDisplay>{getValue() as string}</InlineCellDisplay>
          )}
          edit={() => (
            <InlineCellEdit className="w-80">
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </InlineCellEdit>
          )}
        />
      );
    },
    size: 300,
  },

  {
    id: 'sumDt',
    header: () => (
      <RecordTable.InlineHead icon={IconMoneybag} label="Sum Debit" />
    ),
    accessorKey: 'sumDt',
    cell: ({
      getValue,
      row: {
        original: { _id },
      },
    }) => {
      const [sumDt, setSumDt] = useState(getValue() as number);
      return (
        <InlineCell
          name="sumDt"
          recordId={_id || ''}
          display={() => (
            <InlineCellDisplay>
              <CurrencyDisplay
                currencyValue={{
                  currencyCode: CurrencyCode.MNT,
                  amountMicros: sumDt * 1000000,
                }}
              />
            </InlineCellDisplay>
          )}
          edit={() => (
            <InlineCellEdit>
              <CurrencyInput
                currencyCode={CurrencyCode.MNT}
                value={sumDt}
                onChange={(value) => setSumDt(value)}
              />
            </InlineCellEdit>
          )}
        />
      );
    },
  },
  {
    id: 'sumCt',
    header: () => (
      <RecordTable.InlineHead icon={IconMoneybag} label="Sum Credit" />
    ),
    accessorKey: 'sumCt',
    cell: ({
      getValue,
      row: {
        original: { _id },
      },
    }) => {
      const [sumCt, setSumCt] = useState(getValue() as number);
      return (
        <InlineCell
          name="sumCt"
          recordId={_id || ''}
          display={() => (
            <InlineCellDisplay>
              <CurrencyDisplay
                currencyValue={{
                  currencyCode: CurrencyCode.MNT,
                  amountMicros: sumCt * 1000000,
                }}
              />
            </InlineCellDisplay>
          )}
          edit={() => (
            <InlineCellEdit>
              <CurrencyInput
                currencyCode={CurrencyCode.MNT}
                value={sumCt}
                onChange={(value) => setSumCt(value)}
              />
            </InlineCellEdit>
          )}
        />
      );
    },
  },
  //branch title
  {
    id: 'branchId',
    header: () => <RecordTable.InlineHead icon={IconFile} label="Branch" />,
    accessorKey: 'branchId',
    cell: ({
      getValue,
      row: {
        original: { _id },
      },
    }) => {
      const [branch, setBranch] = useState(getValue() as string);
      return (
        <InlineCell
          name="branchId"
          recordId={_id || ''}
          display={() => (
            <InlineCellDisplay>{getValue() as any}</InlineCellDisplay>
          )}
          edit={() => (
            <InlineCellEdit>
              <Input
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </InlineCellEdit>
          )}
        />
      );
    },
  },
];

export const TransactionMoreColumnCell = ({
  cell,
}: {
  cell: Cell<ITransaction, unknown>;
}) => {
  const [, setOpen] = useQueryState('transaction_id');
  const setRenderingContactDetail = useSetAtom(renderingTransactionDetailState);
  const { _id } = cell.row.original;

  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setOpen(_id);
        setRenderingContactDetail(false);
      }}
    />
  );
};

export const transactionMoreColumn = {
  id: 'more',
  cell: TransactionMoreColumnCell,
  size: 33,
};
