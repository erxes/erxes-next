import { ICompany } from '../types/Company';
import { createContext } from 'react';

export const CompanyInlineContext = createContext<
  (ICompany & { loading: boolean }) | null
>(null);
