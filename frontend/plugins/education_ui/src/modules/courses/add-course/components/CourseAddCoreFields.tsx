import { UseFormReturn } from 'react-hook-form';

import { Form, Input, Separator } from 'erxes-ui';
import { SelectCurrency } from 'erxes-ui/components/select-currency';
import { CURRENCY_CODES } from 'erxes-ui/constants';
import { CurrencyCode } from 'erxes-ui/types';
import { CourseFormType } from '@/courses/add-course/components/formSchema';
import { DescriptionField } from '@/courses/add-course/components/fields';

export const CourseAddCoreFields = ({
  form,
}: {
  form: UseFormReturn<CourseFormType>;
}) => {
  return (
    <div className="grid grid-cols-2 gap-5 ">
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
        name="code"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>CODE</Form.Label>
            <div className="flex flex-col">
              <Form.Control>
                <Input className="rounded-md h-8" {...field} />
              </Form.Control>
              <Form.Message className="text-destructive" />
            </div>
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="unitPrice"
        render={({ field }) => (
          <Form.Item className="flex flex-col">
            <Form.Label>UNIT PRICE</Form.Label>
            <Form.Control>
              <div className="flex rounded-md border border-border shadow-xs">
                <SelectCurrency
                  currencies={CURRENCY_CODES}
                  value={CurrencyCode.USD}
                  displayIcon={true}
                  className="h-full focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none focus-visible:ring-offset-0 rounded-l-md shadow-none "
                />
                <Separator orientation="vertical" />
                <Input
                  className="rounded-md h-8 border-transparent"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={field.value || ''}
                />
              </div>
            </Form.Control>

            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
      <DescriptionField control={form.control} />
    </div>
  );
};
