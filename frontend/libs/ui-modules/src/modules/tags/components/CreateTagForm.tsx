import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { IconChevronLeft, IconLoader } from '@tabler/icons-react';
import { z } from 'zod';

import { Button, Form, Input, Tabs } from 'erxes-ui';

import { useAtom, useSetAtom } from 'jotai';
import { ITag } from '../types/Tag';
import { newTagNameState } from '../states/newTagNameState';
import { useTagsAdd } from '../hooks/useTagsAdd';
import { SelectSingleTag } from './SelectSingleTag';

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
  const [name] = useAtom(newTagNameState);
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
            order: tagsAdd.order,
          });
        }
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
        <Form.Field
          control={form.control}
          name="name"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Name</Form.Label>
              <Input {...field} />
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Parent Tag</Form.Label>
              <SelectSingleTag
                value={field.value}
                onValueChange={field.onChange}
                className="flex"
                tagType={tagType}
              />
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

export function SelectTagCreateContainer({
  children,
  onBack,
}: {
  children: React.ReactNode;
  onBack: () => void;
}) {
  const setName = useSetAtom(newTagNameState);
  return (
    <Tabs.Content value="create" asChild>
      <div className=" p-2 overflow-auto">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setName('');
              onBack();
            }}
            size="icon"
          >
            <IconChevronLeft className="w-4 h-4" />
          </Button>
          <h6 className="text-sm font-medium">Create new tag</h6>
        </div>
        {children}
      </div>
    </Tabs.Content>
  );
}
