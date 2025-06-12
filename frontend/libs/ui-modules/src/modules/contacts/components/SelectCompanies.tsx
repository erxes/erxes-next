import { useState } from 'react';
import { ICompany } from '../types';
import {
  SelectCompanyContext,
  useSelectCompanyContext,
} from '../contexts/SelectCompanyContext';
import { CompanyInline } from './CompanyInline';

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

const SelectCompaniesValue = () => {
  const { companyIds, companies, setCompanies } = useSelectCompanyContext();

  return (
    <CompanyInline
      companyIds={companyIds}
      companies={companies}
      updateCompanies={setCompanies}
    />
  );
};
