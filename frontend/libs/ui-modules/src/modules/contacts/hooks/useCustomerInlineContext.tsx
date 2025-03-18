import { useContext } from 'react';
import { CustomerInlineContext } from '../contexts/CustomerInlineContext';
import { ICustomerInline } from '../types/Customer';

export const useCustomerInlineContext = () => {
  const customerInline = useContext(CustomerInlineContext);

  return customerInline || ({} as ICustomerInline & { loading: boolean });
};
