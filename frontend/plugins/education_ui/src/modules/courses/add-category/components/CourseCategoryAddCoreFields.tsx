import { UseFormReturn } from 'react-hook-form';
import { Form, Input, Select } from 'erxes-ui';
import { CourseCategoryFormType } from '@/courses/add-category/components/formSchema';
import { useCourseCategories } from '@/courses/hooks/useCourseCategories';

export const CourseCategoryAddCoreFields = ({
  form,
}: {
  form: UseFormReturn<CourseCategoryFormType>;
}) => {
  const { courseCategories = [] } = useCourseCategories();

  return (
    <>
      <Form.Field
        control={form.control}
        name="name"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>NAME</Form.Label>
            <Form.Control>
              <Input {...field} />
            </Form.Control>

            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="code"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Code</Form.Label>
            <Form.Control>
              <Input {...field} />
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
            <Form.Label>Description</Form.Label>
            <Form.Control>
              <Input {...field} />
            </Form.Control>

            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />

      <Form.Field
        control={form.control}
        name="parentId"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Parent</Form.Label>
            <Select onValueChange={field.onChange} value={field.value}>
              <Form.Control>
                <Select.Trigger className="truncate w-full rounded-md justify-between text-foreground h-8 hover:bg-muted">
                  <Select.Value placeholder={<span>{'Choose type'}</span>}>
                    <span className="text-foreground font-medium text-sm">
                      {
                        courseCategories?.find(
                          (type) => type._id === field.value,
                        )?.name
                      }
                    </span>
                  </Select.Value>
                </Select.Trigger>
              </Form.Control>
              <Select.Content>
                {courseCategories?.map((category) => (
                  <Select.Item
                    key={category._id}
                    className="text-[13px]"
                    value={category._id}
                  >
                    {category.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
    </>
  );
};
