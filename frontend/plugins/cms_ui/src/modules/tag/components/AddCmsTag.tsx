'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconLoader } from '@tabler/icons-react';

import { Button, Input, Form } from 'erxes-ui';
import { TagAddSheet, TagAddSheetHeader } from './CmsAddSheet';

import { useAddTag } from '../hooks/useCreateTag';
import { useCmsContext } from '~/modules/app/context/CmsContext';

const formSchema = z.object({
  name: z.string().min(1, 'Tag name is required'),
});

export function AddtagForm() {
  const { selectedWebsite } = useCmsContext();

  const cp_Id = selectedWebsite;

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const { tagAdd, loading } = useAddTag();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    tagAdd({
      variables: {
        input: {
          slug: values.name,
          name: values.name,
          clientPortalId: selectedWebsite,
        },
      },
      onCompleted({ cmsTagsAdd }: any) {
        form.reset();
        setOpen(false);
      },
    });
  };

  return (
    <TagAddSheet onOpenChange={setOpen} open={open}>
      <div className="p-4">
        <TagAddSheetHeader />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
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
            <Button type="submit" className="w-full !mt-4" disabled={loading}>
              {loading ? (
                <IconLoader className="w-4 h-4 animate-spin" />
              ) : (
                'Create'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </TagAddSheet>
  );
}
