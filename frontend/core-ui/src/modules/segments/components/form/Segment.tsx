import { IconTrash } from '@tabler/icons-react';
import { Button, Card, Form } from 'erxes-ui/components';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import Property from './Property';
import formSchema from './schema';
import { useQueryState } from 'erxes-ui';

type Props = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  parentFieldName?: `conditionSegments.${number}`;
  onRemove?: () => void;
};

const Segment = ({ form, parentFieldName, onRemove }: Props) => {
  const [selectedContentType] = useQueryState<string>('contentType');
  const {
    fields: conditionFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: parentFieldName ? `${parentFieldName}.conditions` : 'conditions',
  });

  return (
    <Card className="bg-accent rounded-md">
      <Card.Header className="flex flex-row gap-2 items-center px-6 py-2 group">
        <Form.Label className="w-2/5 mt-2 ">Property</Form.Label>
        <Form.Label className="w-1/5 ">Condition</Form.Label>
        <Form.Label className="w-2/5 pl-4">Value</Form.Label>
        {onRemove && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onRemove()}
            className={`opacity-0 ${'group-hover:opacity-100'} transition-opacity`}
          >
            <IconTrash />
          </Button>
        )}
      </Card.Header>
      <Card className="mx-1 p-2 bg-white rounded-md">
        <div className="flex flex-col ">
          {(conditionFields || []).map((condition, index) => (
            <div key={(condition as any).id}>
              <Property
                index={index}
                parentFieldName={parentFieldName}
                condition={condition}
                form={form}
                remove={() => remove(index)}
                isFirst={index === 0}
                isLast={index === conditionFields.length - 1}
                total={conditionFields.length}
              />
            </div>
          ))}
        </div>
        <Button
          className="w-full mt-4"
          variant="secondary"
          onClick={() =>
            append({
              propertyType: selectedContentType || '',
              propertyName: '',
              propertyOperator: '',
            })
          }
        >
          <Form.Label>+ Add Condition</Form.Label>
        </Button>
      </Card>
    </Card>
  );
};

export default Segment;
