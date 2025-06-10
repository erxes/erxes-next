import { Form } from 'erxes-ui';
import { Control } from 'react-hook-form';
import { AssignMember } from 'ui-modules';
import { CourseFormType } from '@/courses/add-course/components/formSchema';

export const OwnerIdField = ({
  control,
}: {
  control: Control<CourseFormType>;
}) => {
  return (
    <Form.Field
      control={control}
      name="ownerId"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>CHOOSE AN TEACHER</Form.Label>
          <Form.Control>
            <div className="w-full">
              <AssignMember
                value={field.value}
                onValueChange={field.onChange}
                className="w-full shadow-xs"
              />
            </div>
          </Form.Control>
          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};
