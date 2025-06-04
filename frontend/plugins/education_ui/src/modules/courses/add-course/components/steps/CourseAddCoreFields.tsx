import { UseFormReturn } from 'react-hook-form';
import { Form, Input, Select } from 'erxes-ui';
import { CourseFormType } from '@/courses/add-course/components/formSchema';
import {
  CategoryField,
  DescriptionField,
} from '@/courses/add-course/components/fields';
import { COURSE_TYPE_OPTIONS } from '@/courses/constants/CourseConstants';

export const CourseAddCoreFields = ({
  form,
}: {
  form: UseFormReturn<CourseFormType>;
}) => {
  return (
    <>
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
      <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
        <Form.Field
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>CATEGORY</Form.Label>
              <Form.Control>
                <CategoryField {...field} />
              </Form.Control>
              <Form.Message className="text-destructive" />
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name="type"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>TYPE</Form.Label>
              <Select onValueChange={field.onChange} value={field.value}>
                <Form.Control>
                  <Select.Trigger className="truncate w-full rounded-md justify-between text-foreground h-8 hover:bg-muted">
                    <Select.Value placeholder={<span>{'Choose type'}</span>}>
                      <span className="text-foreground font-medium text-sm">
                        {
                          COURSE_TYPE_OPTIONS.find(
                            (type) => type.value === field.value,
                          )?.label
                        }
                      </span>
                    </Select.Value>
                  </Select.Trigger>
                </Form.Control>
                <Select.Content>
                  {COURSE_TYPE_OPTIONS.map((type) => (
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
      <DescriptionField control={form.control} />
    </>
  );
};
