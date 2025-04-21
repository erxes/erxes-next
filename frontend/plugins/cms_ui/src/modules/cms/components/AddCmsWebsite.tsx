'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Form } from 'erxes-ui';

import { useAddWebsite } from '../hooks/useCreateWebsite';

import { WebsiteAddSheet, WebsiteAddSheetHeader } from './WebsiteAddSheet';
import { useCmsContext } from '~/modules/app/context/CmsContext';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export function AddWebsiteForm() {
  const { selectedWebsite } = useCmsContext();
  const cp_Id = selectedWebsite;

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const { websiteAdd, loading } = useAddWebsite();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    websiteAdd({
      variables: {
        config: {
          name: values.name,
          description: values.description,
          kind: 'client',
        },
      },
      onCompleted() {
        form.reset();
        setOpen(false);
      },
    });
  };

  return (
    <WebsiteAddSheet onOpenChange={setOpen} open={open}>
      <div className="p-4">
        <WebsiteAddSheetHeader />
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
            <Form.Field
              control={form.control}
              name="description"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Description</Form.Label>
                  <Input {...field} />
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Button type="submit" className="w-full !mt-4" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </form>
        </Form>
      </div>
    </WebsiteAddSheet>
  );
}
