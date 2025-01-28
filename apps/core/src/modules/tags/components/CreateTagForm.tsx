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
import { SelectColor } from 'erxes-ui/modules/select-color/components/selectColor';
import { SelectTags } from '@/tags/components/SelectTags';
import { useTagsAdd } from '@/tags/hooks/useTagsAdd';
import { IconLoader } from '@tabler/icons-react';
import { ITag } from '@/tags/types/tagTypes';

const formSchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
  parentId: z.string().optional(),
});

export const CreateTagForm = ({
  tagType,
  onCompleted,
}: {
  tagType?: string;
  onCompleted?: (tag: ITag) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { addTag, loading } = useTagsAdd();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addTag({
      variables: {
        name: values.name,
        type: tagType,
        colorCode: values.color,
        parentId: values.parentId,
      },
      onCompleted({ tagsAdd }) {
        if (onCompleted) {
          onCompleted({
            _id: tagsAdd._id,
            colorCode: values.color,
            name: values.name,
            parentId: values.parentId,
            order: '',
          });
        }
      },
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
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
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Tag</FormLabel>
              <SelectTags
                tagType={tagType}
                single
                sub
                selected={field.value}
                onSelect={(tag) => field.onChange(tag)}
                className="w-full h-8"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="mb-2">
              <SelectColor
                value={field.value || ''}
                onValueChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full !mt-4" disabled={loading}>
          {loading ? <IconLoader className="w-4 h-4 animate-spin" /> : 'Create'}
        </Button>
      </form>
    </Form>
  );
};
