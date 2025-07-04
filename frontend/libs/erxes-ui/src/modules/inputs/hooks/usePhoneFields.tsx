import { useContext } from 'react';
import { PhoneFieldsContext } from '../contexts/PhoneFieldsContext';

export const usePhoneFields = () => {
  const { recordId, onValueChange, onValidationStatusChange } = useContext(PhoneFieldsContext);
  return { recordId, onValueChange, onValidationStatusChange };
};
