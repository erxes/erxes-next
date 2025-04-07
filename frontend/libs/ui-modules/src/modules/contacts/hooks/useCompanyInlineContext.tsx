import { useContext } from 'react';
import { CompanyInlineContext } from '../contexts/CompanyInlineContext';
import { ICompany } from '../types/Company';

export const useCompanyInlineContext = () => {
  const companyInline = useContext(CompanyInlineContext);

  return companyInline || ({} as ICompany & { loading: boolean });
};
