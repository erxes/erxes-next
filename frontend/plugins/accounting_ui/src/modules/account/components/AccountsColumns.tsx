import { Cell, ColumnDef } from '@tanstack/react-table';
import { IAccount } from '../type/Account';
import {
  CurrencyCode,
  InlineCell,
  InlineCellDisplay,
  ITextFieldContainerProps,
  RecordTable,
  SelectCurrency,
  TextField,
  useQueryState,
} from 'erxes-ui';
import { SelectAccountCategory } from '../account-categories/components/SelectAccountCategory';
import { useAccountEdit } from '../hooks/useAccountEdit';
import { useSetAtom } from 'jotai';
import { accountDetailAtom } from '../states/accountStates';

const AccountCategoryCell = ({ cell }: { cell: Cell<IAccount, unknown> }) => {
  const { editAccount } = useAccountEdit();
  return (
    <SelectAccountCategory
      recordId={cell.row.original._id}
      selected={cell.row.original.categoryId}
      onSelect={(categoryId) => {
        editAccount(
          {
            variables: {
              ...cell.row.original,
              categoryId,
            },
          },
          ['categoryId'],
        );
      }}
      variant="ghost"
      hideChevron
    />
  );
};

const AccountTextField = ({
  value,
  field,
  _id,
  account,
}: ITextFieldContainerProps & { account: IAccount }) => {
  const { editAccount } = useAccountEdit();
  return (
    <TextField
      value={value}
      field={field}
      _id={_id}
      onSave={(value) => {
        editAccount(
          {
            variables: { ...account, [field]: value },
          },
          [field],
        );
      }}
    />
  );
};

const AccountCurrencyCell = ({ cell }: { cell: Cell<IAccount, unknown> }) => {
  const { editAccount } = useAccountEdit();
  return (
    <SelectCurrency
      value={cell.getValue() as CurrencyCode}
      variant="ghost"
      className="w-full focus-visible:relative focus-visible:z-10 font-normal"
      hideChevron
      onChange={(value) => {
        editAccount({ variables: { ...cell.row.original, currency: value } }, [
          'currency',
        ]);
      }}
    />
  );
};

export const accountsColumns: ColumnDef<IAccount>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: () => <RecordTable.InlineHead label="Name" />,
    cell: ({ cell }) => {
      return (
        <AccountTextField
          value={cell.getValue() as string}
          field="name"
          _id={cell.row.original._id}
          account={cell.row.original}
        />
      );
    },
    size: 300,
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: () => <RecordTable.InlineHead label="Code" />,
    cell: ({ cell }) => {
      return (
        <AccountTextField
          value={cell.getValue() as string}
          field="code"
          _id={cell.row.original._id}
          account={cell.row.original}
        />
      );
    },
  },
  {
    id: 'category',
    accessorKey: 'categoryId',
    header: () => <RecordTable.InlineHead label="Category" />,
    cell: AccountCategoryCell,
    size: 240,
  },
  {
    id: 'currency',
    accessorKey: 'currency',
    header: () => <RecordTable.InlineHead label="Currency" />,
    cell: AccountCurrencyCell,
    size: 240,
  },
  {
    id: 'kind',
    accessorKey: 'kind',
    header: () => <RecordTable.InlineHead label="Kind" />,
    cell: ({ cell }) => {
      return (
        <InlineCell
          name={cell.column.id}
          recordId={cell.row.original._id}
          display={() => (
            <InlineCellDisplay>{cell.getValue() as string}</InlineCellDisplay>
          )}
        />
      );
    },
  },
  {
    id: 'journal',
    accessorKey: 'journal',
    header: () => <RecordTable.InlineHead label="Journal" />,
    cell: ({ cell }) => {
      return (
        <InlineCell
          name={cell.column.id}
          recordId={cell.row.original._id}
          display={() => (
            <InlineCellDisplay>{cell.getValue() as string}</InlineCellDisplay>
          )}
        />
      );
    },
  },
];

export const AccountMoreColumnCell = ({
  cell,
}: {
  cell: Cell<IAccount, unknown>;
}) => {
  const [, setOpen] = useQueryState('account_id');
  const setAccountDetail = useSetAtom(accountDetailAtom);
  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setAccountDetail(cell.row.original);
        setOpen(cell.row.original._id);
      }}
    />
  );
};

export const accountMoreColumn = {
  id: 'more',
  cell: AccountMoreColumnCell,
  size: 33,
};
