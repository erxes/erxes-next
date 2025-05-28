'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_TOPIC } from '../graphql/mutations';
import { TOPICS } from '../graphql/queries';
import { Button, Input, Textarea, Sheet, SelectBrand } from 'erxes-ui';

interface NewTopicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewTopicDrawer({ isOpen, onClose }: NewTopicDrawerProps) {
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    brandId: '',
    color: '',
    backgroundImage: '',
    languageCode: '',
    notificationSegmentId: '',
  });

  const [addTopic, { loading }] = useMutation(ADD_TOPIC, {
    refetchQueries: [{ query: TOPICS }],
    onCompleted: () => {
      onClose();
      setFormData({
        code: '',
        title: '',
        description: '',
        brandId: '',
        color: '',
        backgroundImage: '',
        languageCode: '',
        notificationSegmentId: '',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTopic({
      variables: {
        input: formData,
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBrandChange = (brandIds: string[]) => {
    setFormData((prev) => ({ ...prev, brandId: brandIds[0] || '' }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <Sheet.View className="sm:max-w-lg p-0">
        <Sheet.Header className="border-b gap-3">
          <Sheet.Title>New Topic</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Code</label>
            <Input
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter topic code"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter topic title"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter topic description"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Brand <span className="text-red-500">*</span>
            </label>
            <SelectBrand
              values={formData.brandId ? [formData.brandId] : []}
              onValueChange={handleBrandChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
            <Input
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Enter color code"
              type="color"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Background Image</label>
            <Input
              name="backgroundImage"
              value={formData.backgroundImage}
              onChange={handleChange}
              placeholder="Enter background image URL"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Language Code</label>
            <Input
              name="languageCode"
              value={formData.languageCode}
              onChange={handleChange}
              placeholder="Enter language code"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Notification Segment ID
            </label>
            <Input
              name="notificationSegmentId"
              value={formData.notificationSegmentId}
              onChange={handleChange}
              placeholder="Enter notification segment ID"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Topic'}
            </Button>
          </div>
        </form>
      </Sheet.View>
    </Sheet>
  );
}
