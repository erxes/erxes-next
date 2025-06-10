import { DatePicker, Form } from 'erxes-ui';
import { Control } from 'react-hook-form';
import { CourseFormType } from '@/courses/add-course/components/formSchema';

export const DateField = ({
  control,
  name,
  label = 'Date',
}: {
  control: Control<CourseFormType>;
  name: 'startDate' | 'endDate' | 'deadline';
  label: string;
}) => {
  return (
    <Form.Field
      control={control}
      name={name}
      render={({ field }) => (
        <Form.Item>
          <Form.Label>{label}</Form.Label>
          <Form.Control>
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              className="h-8 flex w-full"
            />
          </Form.Control>
        </Form.Item>
      )}
    />
  );
};
