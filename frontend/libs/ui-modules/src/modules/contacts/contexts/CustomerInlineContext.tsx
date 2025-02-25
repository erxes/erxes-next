import { ICustomerInline } from '../types/Customer';
import { createContext } from 'react';

export const CustomerInlineContext = createContext<
  (ICustomerInline & { loading: boolean }) | null
>(null);
