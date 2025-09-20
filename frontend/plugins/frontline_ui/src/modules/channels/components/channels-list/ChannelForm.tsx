import { UseFormReturn } from 'react-hook-form';
import { TChannelForm } from '../../types';
import { Form, Input, Textarea } from 'erxes-ui';
import { SelectMember } from 'ui-modules';

export const ChannelForm = ({
  form,
}: {
  form: UseFormReturn<TChannelForm>;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <Form.Field
        control={form.control}
        name="name"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Name</Form.Label>
            <Form.Control>
              <Input {...field} />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="description"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Description</Form.Label>
            <Form.Control>
              <Textarea {...field} />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="memberIds"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Members</Form.Label>
            <Form.Control>
              <SelectMember.FormItem
                mode="multiple"
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
