import { useState } from 'react';
import { Button, Dialog, Input } from 'erxes-ui';
import { UseFormSetValue } from 'react-hook-form';
import { NodeData } from '../../../types';
import { TAutomationProps } from '@/automations/utils/AutomationFormDefinitions';

type Props = {
  id: string;
  fieldName: 'actions' | 'triggers';
  data: NodeData;
  setValue: UseFormSetValue<TAutomationProps>;
  callback: () => void;
};

export const EditForm = ({
  id,
  fieldName,
  data,
  setValue,
  callback,
}: Props) => {
  const { nodeIndex, label, description } = data || {};

  const [doc, setDoc] = useState({
    label: label || '',
    description: description || '',
  });

  const handleChange = (e: any) => {
    const { value, name } = e.currentTarget as HTMLInputElement;

    setDoc({ ...doc, [name]: value });
  };

  const handleSave = () => {
    setValue(`detail.${fieldName}.${nodeIndex}.label`, doc.label);
    setValue(`detail.${fieldName}.${nodeIndex}.description`, doc.description);
    setValue('activeNode', { ...data, id, ...doc });
    callback();
  };

  return (
    <Dialog.Content>
      <Dialog.Title>Edit Node</Dialog.Title>
      <Input name="label" value={doc.label} onChange={handleChange} />
      <Input
        type="textarea"
        name="description"
        value={doc.description}
        onChange={handleChange}
      />
      <Dialog.Footer>
        <Button onClick={handleSave}>Save</Button>
      </Dialog.Footer>
    </Dialog.Content>
  );
};
