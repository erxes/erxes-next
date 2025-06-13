import { useState } from 'react';
import { ICompany } from '../types';
import {
  SelectCompanyContext,
  useSelectCompanyContext,
} from '../contexts/SelectCompanyContext';
import { CompanyInline } from './CompanyInline';
import { useCompanies } from '../hooks/useCompanies';
import { useDebounce } from 'use-debounce';
import { Command, Combobox } from 'erxes-ui';
import { CompaniesInline } from './CompaniesInline';

const SelectCompaniesProvider = ({
  children,
  value,
  onValueChange,
  mode = 'single',
}: {
  children: React.ReactNode;
  value?: string[] | string;
  onValueChange?: (value: string[] | string) => void;
  mode?: 'single' | 'multiple';
}) => {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const isSingleMode = mode === 'single';

  const onSelect = (company: ICompany) => {
    if (!company) return;
    if (isSingleMode) {
      setCompanies([company]);
      onValueChange?.(company._id);
      return;
    }
    const arrayValue = Array.isArray(value) ? value : [];
    const isCompanySelected = arrayValue.includes(company._id);
    const newSelectedCompanyIds = isCompanySelected
      ? arrayValue.filter((id) => id !== company._id)
      : [...arrayValue, company._id];

    setCompanies((prevCompanies) => {
      const companyMap = new Map(prevCompanies.map((c) => [c._id, c]));
      companyMap.set(company._id, company);
      return newSelectedCompanyIds
        .map((id) => companyMap.get(id))
        .filter((c): c is ICompany => c !== undefined);
    });
    onValueChange?.(newSelectedCompanyIds);
  };
  return (
    <SelectCompanyContext.Provider
      value={{
        companyIds: !value ? [] : Array.isArray(value) ? value : [value],
        onSelect,
        companies,
        setCompanies,
        loading: false,
        error: null,
      }}
    >
      {children}
    </SelectCompanyContext.Provider>
  );
};

const SelectCompaniesValue = ({
  placeholder,
  size,
}: {
  placeholder?: string;
  size?: 'lg';
}) => {
  const { companyIds, companies, setCompanies } = useSelectCompanyContext();

  return (
    <CompaniesInline
      companyIds={companyIds}
      companies={companies}
      updateCompanies={setCompanies}
      placeholder={placeholder}
      size={size}
    />
  );
};

const SelectCompaniesContent = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const { companyIds, companies: selectedCompanies } =
    useSelectCompanyContext();
  const { companies, loading, handleFetchMore, totalCount, error } =
    useCompanies({
      variables: {
        searchValue: debouncedSearch,
        excludeIds: true,
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
      <Command.List>
        {companies?.map((company) => (
          <Command.Item
            key={company._id}
            value={company._id}
            onSelect={() => {
              onSelect(company);
            }}
          >
            <CompanyInline
              companies={[company]}
              placeholder="Unnamed company"
            />
            <Combobox.Check checked={companyIds.includes(company._id)} />
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  );
};

export const SelectCompaniesFilterItem = () => {
  return (
    <Filter.Item value="companies">
      <IconBuilding />
      Company
    </Filter.Item>
  );
};
