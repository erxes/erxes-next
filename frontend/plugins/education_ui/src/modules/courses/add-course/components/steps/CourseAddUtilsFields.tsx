import { UseFormReturn } from 'react-hook-form';
import { CourseFormType } from '@/courses/add-course/components/formSchema';
import { CurrencyField, Form, Input, Upload } from 'erxes-ui';
import { IconUpload } from '@tabler/icons-react';

export const CourseAddUtilsFields = ({
  form,
}: {
  form: UseFormReturn<CourseFormType>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Form.Field
          control={form.control}
          name="location"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Location</Form.Label>
              <Form.Control>
                <Input className="rounded-md h-8" {...field} />
              </Form.Control>

              <Form.Message className="text-destructive" />
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name="unitPrice"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>UNIT PRICE</Form.Label>
              <Form.Control>
                <CurrencyField.ValueInput
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                />
              </Form.Control>
              <Form.Message className="text-destructive" />
            </Form.Item>
          )}
        />
      </div>
      <Form.Field
        control={form.control}
        name="attachment"
        render={({ field }) => (
          <Form.Item className="mb-5">
            <Form.Label>UPLOAD</Form.Label>
            <Form.Control>
              <Upload.Root {...field}>
                <Upload.Preview className="hidden" />
                <Upload.Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  className="w-full h-20 flex flex-col items-center justify-center border border-dashed text-muted-foreground"
                >
                  <IconUpload />
                  <span className="font-medium text-sm">Primary upload</span>
                </Upload.Button>
              </Upload.Root>
            </Form.Control>
            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
    </div>
  );
};
