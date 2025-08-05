import { createContext } from "react";
import { TEmails } from "../components/EmailField";

export const EmailFieldsContext = createContext<{ recordId: string; onValueChange?: (emails: TEmails) => void; noValidation?: boolean; onValidationStatusChange?: (status: 'verified' | 'unverified') => void }>({
  recordId: '',
  onValueChange: undefined,
  noValidation: false,
  onValidationStatusChange: undefined,
});