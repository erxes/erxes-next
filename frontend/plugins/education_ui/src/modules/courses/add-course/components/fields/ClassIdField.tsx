import { Form, Select } from 'erxes-ui';
import { Control } from 'react-hook-form';
import { CourseFormType } from '@/courses/add-course/components/formSchema';
import { useClasses } from '@/classes/hooks/useClasses';

export const ClassIdField = ({
  control,
}: {
  control: Control<CourseFormType>;
}) => {
  const { classes = [] } = useClasses();

  return (
    <Form.Field
      control={control}
      name="classId"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>Class</Form.Label>
          <Select onValueChange={field.onChange} value={field.name}>
            <Form.Control>
              <Select.Trigger className="truncate w-full rounded-md justify-between text-foreground h-8 hover:bg-muted">
                <Select.Value placeholder={<span>{'Choose type'}</span>}>
                  <span className="text-foreground font-medium text-sm">
                    {classes?.find((type) => type._id === field.value)?.name}
                  </span>
                </Select.Value>
              </Select.Trigger>
            </Form.Control>
            <Select.Content>
              {classes?.map((value) => (
                <Select.Item
                  key={value._id}
                  className="text-[13px]"
                  value={value._id}
                >
                  {value.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};
