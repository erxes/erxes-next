import { ApolloError } from '@apollo/client';
import { CommandBar, RecordTable, Separator, toast } from 'erxes-ui';
import { SelectTags } from 'ui-modules';
import { CompaniesDelete } from './delete/CompaniesDelete';
import { CompaniesMerge } from './merge/CompaniesMerge';
export const CompaniesCommandBar = () => {
  const { table } = RecordTable.useRecordTable();
  const intersection = (arrays: string[][]): string[] => {
    if (arrays.length === 0) return [];
    return arrays.reduce((common, current) =>
      common.filter((item) => current.includes(item)),
    );
  };

  const companyIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original._id);
  return (
    <CommandBar open={table.getFilteredSelectedRowModel().rows.length > 0}>
      <CommandBar.Bar>
        <CommandBar.Value>
          {table.getFilteredSelectedRowModel().rows.length} selected
        </CommandBar.Value>
        <Separator.Inline />
        <CompaniesDelete
          companyIds={companyIds}
          rows={table.getFilteredSelectedRowModel().rows}
        />
        <Separator.Inline />
        <SelectTags.CommandbarItem
          mode="multiple"
          tagType="core:company"
          value={intersection(
            table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original.tagIds),
          )}
          targetIds={companyIds}
          options={(newSelectedTagIds) => ({
            update: (cache) => {
              companyIds.forEach((companyId) => {
                cache.modify({
                  id: cache.identify({
                    __typename: 'Company',
                    _id: companyId,
                  }),
                  fields: {
                    tagIds: () => newSelectedTagIds,
                  },
                });
              });
            },
            onError: (e: ApolloError) => {
              toast({
                title: 'Error',
                description: e.message,
              });
            },
          })}
        />
        <Separator.Inline />
        <CompaniesMerge companies={table.getFilteredSelectedRowModel().rows.map((row) => row.original)} rows={table.getFilteredSelectedRowModel().rows} />
      </CommandBar.Bar>
    </CommandBar>
  );
};
