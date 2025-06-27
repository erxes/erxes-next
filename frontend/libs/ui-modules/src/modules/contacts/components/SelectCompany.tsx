import {
  AvatarProps,
  ButtonProps,
  Combobox,
  Command,
  Popover,
  Skeleton,
} from 'erxes-ui';
import { useCompanies } from '../hooks/useCompanies';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { ICompany } from '../types/Company';
import React from 'react';
import { useCompanyInline } from '../hooks/useCompanyInline';
import { CompanyInline } from './CompanyInline';

interface SelectCompanyProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const SelectCompany = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  ButtonProps & SelectCompanyProps
>(({ value, onValueChange, children, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<ICompany | undefined>(
    undefined,
  );

  const handleSelect = (company: ICompany | undefined) => {
    setSelectedCompany(company);
    onValueChange?.(company?._id || '');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      {children ? (
        children
      ) : (
        <SelectCompanyTrigger
          value={value || ''}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          {...props}
          ref={ref}
        />
      )}

      <Combobox.Content>
        <SelectCompanyList
          renderItem={(company) => (
            <SelectCompanyItem
              key={company._id}
              company={company}
              selectedCompany={selectedCompany}
              handleSelect={handleSelect}
            />
          )}
        />
      </Combobox.Content>
    </Popover>
  );
});

export function SelectCompanyList({
  renderItem,
}: {
  renderItem: (company: ICompany) => React.ReactNode;
}) {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const { companies, loading, handleFetchMore, totalCount, error } =
    useCompanies({
      variables: {
        searchValue: debouncedSearch,
      },
    });
  return (
    <Command shouldFilter={false}>
      <Command.Input
        value={search}
        onValueChange={setSearch}
        variant="secondary"
        wrapperClassName="flex-auto"
      />
      <Command.List className="max-h-[300px] overflow-y-auto">
        <Combobox.Empty loading={loading} error={error} />
        {companies?.map((company: ICompany) => renderItem(company))}
        <Combobox.FetchMore
          fetchMore={handleFetchMore}
          currentLength={companies?.length}
          totalCount={totalCount}
        />
      </Command.List>
    </Command>
  );
}

export const SelectCompanyTrigger = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  ButtonProps & {
    value: string;
    selectedCompany?: ICompany;
    setSelectedCompany: (company?: ICompany) => void;
  }
>(({ value, selectedCompany, setSelectedCompany, ...props }, ref) => {
  const { loading } = useCompanyInline({
    variables: { _id: value },
    skip: !value || selectedCompany?._id === value,
    onCompleted: ({ companyDetail }: { companyDetail: ICompany }) => {
      setSelectedCompany({ ...companyDetail, _id: value });
    },
  });

  return (
    <Combobox.Trigger disabled={loading} {...props} ref={ref}>
      {value ? (
        <CompanyInline
          company={selectedCompany}
          avatarProps={{
            size: props.size as AvatarProps['size'],
          }}
        />
      ) : loading ? (
        <Skeleton className="w-full h-8" />
      ) : (
        <Combobox.Value placeholder="Select company" />
      )}
    </Combobox.Trigger>
  );
});

export const SelectCompanyItem = ({
  company,
  selectedCompany,
  handleSelect,
}: {
  company: ICompany;
  selectedCompany?: ICompany;
  handleSelect: (company?: ICompany) => void;
}) => {
  const isSelected = selectedCompany?._id === company._id;
  return (
    <Command.Item
      key={company._id}
      value={company._id}
      onSelect={() => handleSelect(isSelected ? undefined : company)}
    >
      <CompanyInline company={company} />
      <Combobox.Check checked={isSelected} />
    </Command.Item>
  );
};
