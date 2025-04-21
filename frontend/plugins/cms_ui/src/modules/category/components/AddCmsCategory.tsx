'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Input, Form, Select } from 'erxes-ui';
import { CategoryAddSheet, CategoryAddSheetHeader } from './AddCategoerySheet';
import { useCmsContext } from '~/modules/app/context/CmsContext';
import { useAddCategory } from '../hooks/useCreateCategory';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  type: z.string().min(1, 'Type is required'),
  status: z.string().min(1, 'Status is required'),
  categoryId: z.string().optional(),
  tag: z.string().optional(),
  featured: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

const types = [
  { value: 'article', label: 'Article' },
  { value: 'video', label: 'Video' },
];

const statuses = [
  { value: 'active', label: 'active' },
  { value: 'inactive', label: 'inactive' },
];

export function AddCategoryForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      type: '',
      status: '',
      categoryId: '',
      tag: '',
      featured: false,
      seoTitle: '',
      seoDescription: '',
    },
  });

  const { selectedWebsite } = useCmsContext();
  const cp_Id = selectedWebsite;
  const [open, setOpen] = useState(false);

  const { categoryAdd, loading } = useAddCategory();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    categoryAdd({
      variables: {
        input: {
          slug: values.name,
          name: values.name,
          description: values.description,
          status: 'active',
          parentId: '',
          clientPortalId: selectedWebsite,
        },
      },
      onCompleted({ categoryAdd }: any) {
        form.reset();
        setOpen(false);
      },
    });
  };

  return (
    <CategoryAddSheet onOpenChange={setOpen} open={open}>
      <div className="p-4">
        <CategoryAddSheetHeader />
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
              name="slug"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Slug</Form.Label>
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
              name="type"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Parent Category</Form.Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <Form.Control>
                      <Select.Trigger className="w-full h-8">
                        <Select.Value placeholder="Select type" />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {types.map((t) => (
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
              name="status"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Status</Form.Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <Form.Control>
                      <Select.Trigger className="w-full h-8">
                        <Select.Value placeholder="Select status" />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {statuses.map((s) => (
                        <Select.Item key={s.value} value={s.value}>
                          {s.label}
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
    </CategoryAddSheet>
  );
}
