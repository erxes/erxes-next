import { Cell, ColumnDef } from '@tanstack/table-core';
import { IAccountCategory } from '../types/AccountCategory';
import {
  ITextFieldContainerProps,
  RecordTable,
  TextField,
  useQueryState,
} from 'erxes-ui';
import { useAccountCategories } from '../hooks/useAccountCategories';
import { useAccountCategoryEdit } from '../hooks/useAccountCategoryEdit';
import { SelectAccountCategory } from './SelectAccountCategory';
import { useSetAtom } from 'jotai';
import { accountCategoryDetailAtom } from '../states/accountCategoryStates';
import { AccountCategoriesCommandbar } from './AccountCategoriesCommandbar';
export const AccountCategoriesTable = () => {
  const { accountCategories } = useAccountCategories();
  return (
    <RecordTable.Provider
      columns={accountCategoriesColumns}
      data={accountCategories || []}
      stickyColumns={['name']}
    >
      <RecordTable>
        <RecordTable.Header />
        <RecordTable.Body>
          <RecordTable.RowList />
        </RecordTable.Body>
      </RecordTable>
      <AccountCategoriesCommandbar />
    </RecordTable.Provider>
  );
};

const AccountTextField = ({
  value,
  field,
  _id,
  accountCategory,
}: ITextFieldContainerProps & { accountCategory: IAccountCategory }) => {
  const { editAccountCategory } = useAccountCategoryEdit();
  return (
    <TextField
      value={value}
      field={field}
      _id={_id}
      onSave={(value) => {
        editAccountCategory({
          variables: { ...accountCategory, [field]: value },
        });
      }}
    />
  );
};

const AccountCategoryMoreColumnCell = ({
  cell,
}: {
  cell: Cell<IAccountCategory, unknown>;
}) => {
  const [, setOpen] = useQueryState('accountCategoryId');
  const setAccountCategoryDetail = useSetAtom(accountCategoryDetailAtom);
  return (
    <RecordTable.MoreButton
      className="w-full h-full"
      onClick={() => {
        setAccountCategoryDetail(cell.row.original);
        setOpen(cell.row.original._id);
      }}
    />
  );
};

export const accountCategoryMoreColumn = {
  id: 'more',
  cell: AccountCategoryMoreColumnCell,
  size: 33,
};

export const accountCategoriesColumns: ColumnDef<IAccountCategory>[] = [
  accountCategoryMoreColumn,
  RecordTable.checkboxColumn as ColumnDef<IAccountCategory>,
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
          accountCategory={cell.row.original}
        />
      );
    },
    size: 250,
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
          accountCategory={cell.row.original}
        />
      );
    },
    size: 200,
  },
  {
    id: 'parentId',
    accessorKey: 'parentId',
    header: () => <RecordTable.InlineHead label="Parent" />,
    cell: ({ cell }) => <AccountCategoryParentCell cell={cell} />,
    size: 250,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: () => <RecordTable.InlineHead label="Description" />,
    cell: ({ cell }) => {
      return (
        <AccountTextField
          value={cell.getValue() as string}
          field="description"
          _id={cell.row.original._id}
          accountCategory={cell.row.original}
        />
      );
    },
    size: 300,
  },
];

const AccountCategoryParentCell = ({
  cell,
}: {
  cell: Cell<IAccountCategory, unknown>;
}) => {
  const { editAccountCategory } = useAccountCategoryEdit();
  return (
    <SelectAccountCategory
      recordId={cell.row.original._id}
      selected={cell.row.original.parentId}
      exclude={[cell.row.original._id]}
      className="w-full font-normal"
      nullable
      onSelect={(parentId) => {
        editAccountCategory({
          variables: {
            ...cell.row.original,
            parentId,
          },
        });
      }}
      variant="ghost"
      hideChevron
    />
  );
};
