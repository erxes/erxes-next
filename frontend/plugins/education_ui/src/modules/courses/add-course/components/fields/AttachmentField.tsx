import { Control } from 'react-hook-form';

import { Form, Upload } from 'erxes-ui';

import { CourseFormType } from '@/courses/add-course/components/formSchema';

export const AttachmentField = ({
  control,
}: {
  control: Control<CourseFormType>;
}) => {
  return (
    <Form.Field
      name="attachment"
      control={control}
      render={({ field }) => (
        <Form.Item>
          <Form.Control>
            <Upload.Root
              {...field}
              value={field.value || ''}
              onChange={(fileInfo) => {
                if ('url' in fileInfo) {
                  field.onChange(fileInfo.url);
                }
              }}
            >
              <Upload.Preview className="rounded-full" />
              <div className="flex flex-col gap-2 justify-center">
                <div className="flex gap-4">
                  <Upload.Button size="sm" variant="outline" type="button">
                    Upload picture
                  </Upload.Button>

                  <Upload.RemoveButton
                    size="sm"
                    variant="outline"
                    type="button"
                  />
                </div>
                <Form.Description>
                  Recommended size 1:1, up to 2MB
                </Form.Description>
              </div>
            </Upload.Root>
          </Form.Control>
        </Form.Item>
      )}
    />
  );
};
