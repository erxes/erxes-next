'use client';

import { Accordion, DropdownMenu, Spinner, useConfirm } from 'erxes-ui';
import { Ellipsis } from 'lucide-react';
import { useState } from 'react';
import { NewCategoryDrawer } from './NewCategoryDrawer';

interface Topic {
  _id: string;
  title: string;
  description: string;
  categories: Array<{
    _id: string;
    title: string;
    description: string;
  }>;
}

interface TopicListProps {
  topics: Topic[];
  loading: boolean;
  selectedTopic: string | null;
  onTopicSelect: (topicId: string) => void;
  onCategorySelect: (categoryId: string) => void;
  removeTopic: (topicId: string) => void;
  onEditTopic: (topic: Topic) => void;
}

export function TopicList({
  topics,
  loading,
  selectedTopic,
  onTopicSelect,
  onCategorySelect,
  removeTopic,
  onEditTopic,
}: TopicListProps) {
  const [isNewCategoryDrawerOpen, setIsNewCategoryDrawerOpen] = useState(false);
  const [selectedTopicForCategory, setSelectedTopicForCategory] = useState<
    string | null
  >(null);

  const { confirm } = useConfirm();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  const handleDeleteTopic = async (topic: Topic) => {
    const categoryCount = topic.categories.length;
    const message = `Are you sure you want to delete "${topic.title}"? This will also delete ${categoryCount} categories and all their associated articles. This action cannot be undone.`;

    const confirmOptions = {
      confirmationValue: 'delete',
      description: 'This action is permanent and cannot be undone.',
    };

    try {
      await confirm({
        message,
        options: confirmOptions,
      });

      removeTopic(topic._id);
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const renderTopicActions = (topic: Topic) => (
    <DropdownMenu>
      <DropdownMenu.Trigger className="ml-2 p-2">
        <Ellipsis className="w-4 h-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={() => onEditTopic(topic)}>
          Edit Topic
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={() => {
            setSelectedTopicForCategory(topic._id);
            setIsNewCategoryDrawerOpen(true);
          }}
        >
          Add Category
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          onClick={() => handleDeleteTopic(topic)}
          className="text-red-600"
        >
          Delete Topic
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );

  return (
    <div className="overflow-y-auto h-[calc(100vh-80px)]">
      <Accordion type="single" collapsible>
        {topics.map((topic) => (
          <Accordion.Item
            key={topic._id}
            value={topic._id}
            className="border-b"
          >
            <Accordion.Trigger className="flex items-center justify-between w-full p-4">
              <div className="flex items-center justify-between w-full">
                <span>{topic.title}</span>
                {renderTopicActions(topic)}
              </div>
            </Accordion.Trigger>
            <Accordion.Content className="px-4 pb-4">
              <div className="text-sm text-gray-500 mb-2">
                {topic.description}
              </div>
              <div className="space-y-2">
                {topic.categories.map((category) => (
                  <div
                    key={category._id}
                    className="p-2 hover:bg-gray-50 cursor-pointer rounded"
                    onClick={() => onCategorySelect(category._id)}
                  >
                    <div className="font-medium">{category.title}</div>
                    <div className="text-sm text-gray-500">
                      {category.description}
                    </div>
                  </div>
                ))}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>

      <NewCategoryDrawer
        topicId={selectedTopicForCategory}
        isOpen={isNewCategoryDrawerOpen}
        onClose={() => {
          setIsNewCategoryDrawerOpen(false);
          setSelectedTopicForCategory(null);
        }}
      />
    </div>
  );
}
