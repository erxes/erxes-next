import { createContext } from "react";
import { TPhones } from "../components/PhoneField";

export const PhoneFieldsContext = createContext<{ recordId: string; onValueChange?: (phones: TPhones) => void }>({
  recordId: '',
  onValueChange: undefined,
});