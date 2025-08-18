import { createContext } from 'react';
import { IEmailStatus, TEmails } from '../components/EmailField';

export const EmailFieldsContext = createContext<{
  recordId: string;
  onValueChange?: (emails: TEmails) => void;
  noValidation?: boolean;
  onValidationStatusChange?: (status: IEmailStatus) => void;
}>({
  recordId: '',
  onValueChange: undefined,
  noValidation: false,
  onValidationStatusChange: undefined,
});
