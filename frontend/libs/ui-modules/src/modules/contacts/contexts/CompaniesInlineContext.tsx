import React, { useContext } from 'react';
import { ICompany } from '../types';

export interface ICompaniesInlineContext {
  companies: ICompany[];
  loading: boolean;
  companyIds?: string[];
  placeholder: string;
  updateCompanies?: (companies: ICompany[]) => void;
}

export const CompaniesInlineContext =
  React.createContext<ICompaniesInlineContext | null>(null);

export const useCompaniesInlineContext = () => {
  const context = useContext(CompaniesInlineContext);
  if (!context) {
    throw new Error(
      'useCompaniesInlineContext must be used within a CompaniesInlineProvider',
    );
  }
  return context;
};
