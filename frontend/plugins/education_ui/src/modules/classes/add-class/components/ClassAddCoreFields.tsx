import { UseFormReturn } from 'react-hook-form';
import { Form, Input, Select } from 'erxes-ui';
import { CLASS_LEVEL_OPTIONS } from '@/classes/constants/ClassConstants';
import { ClassFormType } from '@/classes/add-class/components/formSchema';

export const ClassAddCoreFields = ({
  form,
}: {
  form: UseFormReturn<ClassFormType>;
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      <Form.Field
        control={form.control}
        name="name"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>NAME</Form.Label>
            <Form.Control>
              <Input className="rounded-md h-8" {...field} />
            </Form.Control>

            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="description"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>DESCRIPTION</Form.Label>
            <Form.Control>
              <Input className="rounded-md h-8" {...field} />
            </Form.Control>

            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="location"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>LOCATION</Form.Label>
            <Form.Control>
              <Input className="rounded-md h-8" {...field} />
            </Form.Control>

            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="level"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>LEVEL</Form.Label>
            <Select onValueChange={field.onChange} value={field.value}>
              <Form.Control>
                <Select.Trigger className="truncate w-full rounded-md justify-between text-foreground h-8 hover:bg-muted">
                  <Select.Value placeholder={<span>{'Choose type'}</span>}>
                    <span className="text-foreground font-medium text-sm">
                      {
                        CLASS_LEVEL_OPTIONS.find(
                          (type) => type.value === field.value,
                        )?.label
                      }
                    </span>
                  </Select.Value>
                </Select.Trigger>
              </Form.Control>
              <Select.Content>
                {CLASS_LEVEL_OPTIONS.map((type) => (
                  <Select.Item
                    key={type.value}
                    className="text-[13px]"
                    value={type.value}
                  >
                    {type.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
    </div>
  );
};
