'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_CATEGORY } from '../graphql/mutations';
import { Sheet, Button } from 'erxes-ui';

interface NewCategoryDrawerProps {
  topicId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NewCategoryDrawer({
  topicId,
  isOpen,
  onClose,
}: NewCategoryDrawerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const [addCategory, { loading }] = useMutation(ADD_CATEGORY, {
    onCompleted: () => {
      onClose();
      setTitle('');
      setDescription('');
      setError('');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!topicId) {
      setError('Topic ID is required');
      return;
    }

    addCategory({
      variables: {
        input: {
          title: title.trim(),
          description: description.trim(),
          topicId,
        },
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose} modal>
      <Sheet.View className="sm:max-w-lg p-0">
        <Sheet.Header className="border-b gap-3">
          <Sheet.Title>New Category</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>

        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter category title"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter category description"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Sheet.View>
    </Sheet>
  );
}
