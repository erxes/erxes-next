import { useContext } from "react";
import { EmailFieldsContext } from "../contexts/EmailFieldsContext";


export const useEmailFields = () => {
  const { recordId, onValueChange, noValidation, onValidationStatusChange } = useContext(EmailFieldsContext);
  return { recordId, onValueChange, noValidation, onValidationStatusChange };
};
