import { useContext } from "react";
import { EmailFieldsContext } from "../contexts/EmailFieldsContext";


export const useEmailFields = () => {
  const { recordId, onValueChange } = useContext(EmailFieldsContext);
  return { recordId, onValueChange };
};
