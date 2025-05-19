'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Input, Form, Select } from 'erxes-ui';
import {
  CustomFieldAddSheet,
  CustomFieldAddSheetHeader,
} from './AddCustomFieldSheet';
import { useCmsContext } from '~/modules/app/context/CmsContext';
const parent = [
  { value: 'parent1', label: 'parent1' },
  { value: 'parent2', label: 'parent2' },
];

const type = [
  { value: 'input', label: 'input' },
  { value: 'nuber', label: 'number' },
  { value: 'string', label: 'string' },
];
const formSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  pluralLabel: z.string().min(1, 'Plural label is required'),
  description: z.string().optional(),
  key: z.string().min(1, 'Key is required'),
  type: z.string().min(1, 'Type is required'),
  parent: z.string().optional(),
});

export function AddCustomFieldForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parent: '',
      type: '',
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
    <CustomFieldAddSheet onOpenChange={setOpen} open={open}>
      <div className="p-4">
        <CustomFieldAddSheetHeader />
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
              name="key"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Key</Form.Label>
                  <Input {...field} />
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="parent"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Parent</Form.Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <Form.Control>
                      <Select.Trigger className="w-full h-8">
                        <Select.Value placeholder="Select type" />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {parent.map((t) => (
                        <Select.Item key={t.value} value={t.value}>
                          {t.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="type"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>type</Form.Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <Form.Control>
                      <Select.Trigger className="w-full h-8">
                        <Select.Value placeholder="Select type" />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {type.map((t) => (
                        <Select.Item key={t.value} value={t.value}>
                          {t.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
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
    </CustomFieldAddSheet>
  );
}
