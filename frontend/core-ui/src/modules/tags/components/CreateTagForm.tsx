import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { IconLoader } from '@tabler/icons-react';
import { z } from 'zod';

import { Button, Form, Input } from 'erxes-ui/components';

import { SelectTags } from '@/tags/components/SelectTags';
import { useTagsAdd } from '@/tags/hooks/useTagsAdd';
import { newTagNameAtom } from '@/tags/states/selectTagsStates';
import { ITag } from '@/tags/types/tagTypes';
import { useAtom } from 'jotai';
import { useId } from 'react';

const formSchema = z.object({
  name: z.string().min(1),
  parentId: z.string().optional(),
});

export const CreateTagForm = ({
  tagType,
  onCompleted,
}: {
  tagType: string;
  onCompleted?: (tag: ITag) => void;
}) => {
  const id = useId();
  const [name] = useAtom(newTagNameAtom);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
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
        <Form.Field
          name="name"
          control={form.control}
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Name</Form.Label>
              <Form.Control>
                <Input {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field
          name="parentId"
          control={form.control}
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Parent Tag</Form.Label>
              <Form.Control>
                <SelectTags
                  recordId={id}
                  tagType={tagType}
                  single
                  sub
                  selected={field.value}
                  onSelect={(tags) => field.onChange(tags[0])}
                  className="w-full h-8"
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Button type="submit" className="w-full !mt-4" disabled={loading}>
          {loading ? <IconLoader className="w-4 h-4 animate-spin" /> : 'Create'}
        </Button>
      </form>
    </Form>
  );
};
