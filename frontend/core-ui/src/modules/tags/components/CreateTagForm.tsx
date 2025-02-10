import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { IconLoader } from '@tabler/icons-react';
import { useRecoilValue } from 'recoil';
import { z } from 'zod';

import {
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from 'erxes-ui/components';
import { SelectColor } from 'erxes-ui/modules/select-color/components/SelectColor';

import { SelectTags } from '@/tags/components/SelectTags';
import { useTagsAdd } from '@/tags/hooks/useTagsAdd';
import { newTagNameAtom } from '@/tags/states/selectTagsStates';
import { ITag } from '@/tags/types/tagTypes';

const formSchema = z.object({
  name: z.string().min(1),
  colorCode: z.string().optional(),
  parentId: z.string().optional(),
});

export const CreateTagForm = ({
  tagType,
  onCompleted,
}: {
  tagType?: string;
  onCompleted?: (tag: ITag) => void;
}) => {
  const name = useRecoilValue(newTagNameAtom);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      colorCode: 'empty',
      parentId: '',
    },
  });
  const { addTag, loading } = useTagsAdd();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addTag({
      variables: {
        ...values,
        type: tagType,
      },
      onCompleted({ tagsAdd }) {
        if (onCompleted) {
          onCompleted({
            _id: tagsAdd._id,
            ...values,
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
          name="colorCode"
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
