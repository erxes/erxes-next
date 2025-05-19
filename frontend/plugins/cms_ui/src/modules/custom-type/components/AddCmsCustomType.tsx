'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Input, Form } from 'erxes-ui';
import {
  CustomTypeAddSheet,
  CustomTypeAddSheetHeader,
} from './AddCustomTypeSheet';
import { useCmsContext } from '~/modules/app/context/CmsContext';

const formSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  pluralLabel: z.string().min(1, 'Plural label is required'),
  description: z.string().optional(),
  key: z.string().min(1, 'Key is required'),
});

export function AddCustomTypeForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: '',
      pluralLabel: '',
      description: '',
      key: '',
    },
  });

  const { selectedWebsite } = useCmsContext();
  const [open, setOpen] = useState(false);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('Form Submitted:', values);
    form.reset();
    setOpen(false);
  };

  return (
    <CustomTypeAddSheet onOpenChange={setOpen} open={open}>
      <div className="p-4">
        <CustomTypeAddSheetHeader />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <Form.Field
              control={form.control}
              name="label"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Label</Form.Label>
                  <Input {...field} />
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="pluralLabel"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Plural Label</Form.Label>
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
            <Form.Field
              control={form.control}
              name="key"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Key</Form.Label>
                  <Input {...field} />
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Button type="submit" className="w-full !mt-4">
              Create
            </Button>
          </form>
        </Form>
      </div>
    </CustomTypeAddSheet>
  );
}
