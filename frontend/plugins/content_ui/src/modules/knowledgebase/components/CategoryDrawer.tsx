'use client';

import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { ADD_CATEGORY, EDIT_CATEGORY } from '../graphql/mutations';
import { CATEGORIES } from '../graphql/queries';
import { Form, Input, Sheet, Button, Textarea, IconPicker } from 'erxes-ui';
import { ICategory } from '../types';

interface CategoryDrawerProps {
  category?: ICategory;
  topicId?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryFormData {
  code: string;
  title: string;
  description: string;
  icon: string;
  topicId: string;
  parentCategoryId?: string;
}

export function CategoryDrawer({
  category,
  topicId,
  isOpen,
  onClose,
}: CategoryDrawerProps) {
  const isEditing = !!category;

  const form = useForm<CategoryFormData>({
    defaultValues: {
      code: '',
      title: '',
      description: '',
      icon: '',
      topicId: topicId || '',
      parentCategoryId: '',
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        code: category.code || '',
        title: category.title || '',
        description: category.description || '',
        icon: category.icon || '',
        topicId: category.topicId || '',
        parentCategoryId: category.parentCategoryId || '',
      });
    } else {
      form.reset({
        code: '',
        title: '',
        description: '',
        icon: '',
        topicId: topicId || '',
        parentCategoryId: '',
      });
    }
  }, [category, topicId, form]);

  const [addCategory, { loading: adding }] = useMutation(ADD_CATEGORY, {
    refetchQueries: [{ query: CATEGORIES }],
    onCompleted: () => {
      onClose();
      form.reset();
    },
  });

  const [editCategory, { loading: editing }] = useMutation(EDIT_CATEGORY, {
    refetchQueries: [{ query: CATEGORIES }],
    onCompleted: () => {
      onClose();
      form.reset();
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    if (isEditing && category) {
      editCategory({
        variables: {
          _id: category._id,
          input: data,
        },
      });
    } else {
      addCategory({
        variables: {
          input: data,
        },
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <Sheet.View className="sm:max-w-lg p-0">
        <Sheet.Header className="border-b gap-3">
          <Sheet.Title>
            {isEditing ? 'Edit Category' : 'New Category'}
          </Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 space-y-4"
          >
            <Form.Field
              control={form.control}
              name="code"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Code</Form.Label>
                  <Form.Control>
                    <Input {...field} placeholder="Enter category code" />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="title"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Title</Form.Label>
                  <Form.Control>
                    <Input
                      {...field}
                      placeholder="Enter category title"
                      required
                    />
                  </Form.Control>
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
                  <Form.Control>
                    <Textarea
                      {...field}
                      placeholder="Enter category description"
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="icon"
              render={({ field }) => (
                <Form.Item className="flex flex-col gap-2">
                  <Form.Label>Icon</Form.Label>
                  <Form.Control>
                    <IconPicker value={field.value} onChange={field.onChange} />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={adding || editing}>
                {adding || editing
                  ? isEditing
                    ? 'Saving...'
                    : 'Creating...'
                  : isEditing
                  ? 'Save Changes'
                  : 'Create Category'}
              </Button>
            </div>
          </form>
        </Form>
      </Sheet.View>
    </Sheet>
  );
}
