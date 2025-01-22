import { z } from 'zod';
import {
  Form,
  Input,
  FormField,
  Button,
  FormItem,
  FormLabel,
  FormMessage,
} from 'erxes-ui/components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectColor } from 'erxes-ui/modules/plugin-header/selectColor';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  color: z.string().min(2).max(50),
});

export const CreateTagForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 py-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Color</FormLabel>
              <SelectColor />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-4">
          Create
        </Button>
      </form>
    </Form>
  );
};
