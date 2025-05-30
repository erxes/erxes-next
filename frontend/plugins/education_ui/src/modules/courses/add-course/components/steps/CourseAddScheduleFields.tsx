import { UseFormReturn } from 'react-hook-form';
import { CourseFormType } from '@/courses/add-course/components/formSchema';
import {
  ClassIdField,
  DateField,
  OwnerIdField,
  SelectDaysField,
} from '@/courses/add-course/components/fields';
import { Form, Input } from 'erxes-ui';

export const CourseAddScheduleFields = ({
  form,
}: {
  form: UseFormReturn<CourseFormType>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <ClassIdField control={form.control} />
        <OwnerIdField control={form.control} />
        <DateField
          name="startDate"
          control={form.control}
          label={'Start Date'}
        />
        <DateField name="endDate" control={form.control} label={'End Date'} />
      </div>
      <SelectDaysField control={form.control} />
      <div className="grid grid-cols-2 gap-4">
        <Form.Field
          control={form.control}
          name="limit"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Багтаамж</Form.Label>
              <Form.Control>
                <Input.Number className="rounded-md h-8" {...field} />
              </Form.Control>

              <Form.Message className="text-destructive" />
            </Form.Item>
          )}
        />
        <DateField name="deadline" control={form.control} label={'Deadline'} />
      </div>
    </div>
  );
};
