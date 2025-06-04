import { Control } from 'react-hook-form';

import { Form, Editor } from 'erxes-ui';

import { CourseFormType } from '@/courses/add-course/components/formSchema';
import { CourseHotKeyScope } from '@/courses/types/CourseHotKeyScope';

export const DescriptionField = ({
  control,
}: {
  control: Control<CourseFormType>;
}) => {
  return (
    <Form.Field
      control={control}
      name="description"
      render={({ field }) => (
        <Form.Item className="mb-5">
          <Form.Label>DESCRIPTION</Form.Label>

          <Form.Control>
            <Editor
              initialContent={field.value}
              onChange={field.onChange}
              scope={CourseHotKeyScope.CourseAddSheetDescriptionField}
            />
          </Form.Control>
          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};
