import { createContext } from "react";
import { TEmails } from "../components/EmailField";

export const EmailFieldsContext = createContext<{ recordId: string; onValueChange?: (emails: TEmails) => void; noValidation?: boolean }>({
  recordId: '',
  onValueChange: undefined,
  noValidation: false,
});