import { useLocation } from 'react-router';
import { ContactsPath } from '@/types/paths/ContactsPath';
import {
  CUSTOMERS_CURSOR_SESSION_KEY,
  LEADS_CURSOR_SESSION_KEY,
} from '@/contacts/customers/constants/customersCursorSessionKey';

export const useIsCustomerLeadSessionKey = () => {
  const pathname = useLocation().pathname;

  const isLead = pathname.includes(ContactsPath.Leads);

  return {
    isLead,
    sessionKey: isLead
      ? LEADS_CURSOR_SESSION_KEY
      : CUSTOMERS_CURSOR_SESSION_KEY,
  };
};
