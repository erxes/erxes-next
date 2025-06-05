import { useFormContext } from 'react-hook-form';
import { Form, Input } from 'erxes-ui';
import { AssignMultipleMembers } from 'ui-modules';
import { TPositionForm } from '../../types/position';
import { SelectPosition } from 'ui-modules/modules/structure/components/SelectPosition';

export const PositionForm = () => {
  const { control } = useFormContext<TPositionForm>();

  return (
    <div className="grid grid-cols-2 gap-2">
      <Form.Field
        control={control}
        name="title"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>{field.name}</Form.Label>
            <Form.Control>
              <Input {...field} placeholder="Title" />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="code"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>{field.name}</Form.Label>
            <Form.Control>
              <Input {...field} placeholder="Code" />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="userIds"
        render={({ field }) => {
          console.log('field', field);
          return (
            <Form.Item className="col-span-2">
              <Form.Label>{'Team members'}</Form.Label>
              <Form.Control>
                <AssignMultipleMembers
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          );
        }}
      />
      <Form.Field
        control={control}
        name="parentId"
        render={({ field }) => (
          <Form.Item className="col-span-2">
            <Form.Label>{'Parent'}</Form.Label>
            <Form.Control>
              <SelectPosition
                value={field.value}
                onValueChange={field.onChange}
              />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
    </div>
  );
};
