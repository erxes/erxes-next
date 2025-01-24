import { useCallback } from 'react';
import { useCreateOwner } from '@/organization/owner/hooks/useCreateOwner';
import {
  Form,
  Button,
  FormControl,
  FormField,
  FormItem,
  Input,
  Select,
  Checkbox,
  FormLabel,
  FormMessage,
} from 'erxes-ui/components';
import { SubmitHandler } from 'react-hook-form';
import {
  CreateOwnerFormType,
  PURPOSE_OPTIONS,
  useCreateOwnerForm,
} from '@/organization/owner/hooks/useCreateOwnerForm';

export const CreateOwner = () => {
  const { form } = useCreateOwnerForm();
  const { createOwner } = useCreateOwner();

  const submitHandler: SubmitHandler<CreateOwnerFormType> = useCallback(
    async (data) => {
      createOwner(data);
    },
    [createOwner]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="mx-auto grid w-[350px] gap-5"
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="firstName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="text" placeholder="Enter first name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="lastName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="text" placeholder="Enter last name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="purpose"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <Select.Trigger
                    className={!field.value ? 'text-muted-foreground' : ''}
                  >
                    {field.value || 'Select purpose'}
                  </Select.Trigger>
                  <Select.Content>
                    {PURPOSE_OPTIONS.map((option) => (
                      <Select.Item key={option.value} value={option.value}>
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="subscribeEmail"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Subscribe to email updates</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit">Create Owner</Button>
      </form>
    </Form>
  );
};
