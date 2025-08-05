import { FormType } from '@/documents/hooks/useDocumentForm';
import { Button, useQueryState } from 'erxes-ui';
import { useCallback } from 'react';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { useDocument } from '../hooks/useDocument';

export const DocumentSheet = () => {
  const [documentId, setDocumentId] = useQueryState('documentId');

  const { documentSave } = useDocument();

  const { handleSubmit } = useFormContext<FormType>();

  const submitHandler: SubmitHandler<FormType> = useCallback(async () => {
    documentSave();
  }, [documentSave]);

  if (!documentId) {
    return <Button onClick={() => setDocumentId(' ')}>Add Document</Button>;
  }

  return <Button onClick={handleSubmit(submitHandler)}>Save Document</Button>;
};
