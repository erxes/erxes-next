import { createContext } from "react";
import { TPhones } from "../components/PhoneField";

export const PhoneFieldsContext = createContext<{ recordId: string; onValueChange?: (phones: TPhones) => void, onValidationStatusChange?: (status: 'verified' | 'unverified')=> void}>({
  recordId: '',
  onValueChange: undefined,
  onValidationStatusChange: undefined,
});