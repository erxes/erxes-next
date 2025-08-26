import { FormType } from '@/documents/hooks/useDocumentForm';
import { Button, useQueryState } from 'erxes-ui';
import { useCallback } from 'react';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { useDocument } from '../hooks/useDocument';

export const DocumentSheet = () => {
  const [documentId, setDocumentId] = useQueryState('documentId');
  const [contentType] = useQueryState('contentType');

  const { reset: resetForm } = useFormContext();

  const { documentSave } = useDocument();

  const { handleSubmit } = useFormContext<FormType>();

  const submitHandler: SubmitHandler<FormType> = useCallback(async () => {
    documentSave();
  }, [documentSave]);

  if (!contentType) {
    return null;
  }

  if (!documentId) {
    return (
      <Button
        onClick={() => {
          setDocumentId(' ');
          resetForm();
        }}
      >
        Add Document
      </Button>
    );
  }

  return <Button onClick={handleSubmit(submitHandler)}>Save Document</Button>;
};
