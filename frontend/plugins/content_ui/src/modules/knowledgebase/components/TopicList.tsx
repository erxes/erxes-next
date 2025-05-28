'use client';

import { useState } from 'react';
import { Accordion, DropdownMenu, Spinner } from 'erxes-ui';

import { NewCategoryDrawer } from './NewCategoryDrawer';
import { EditTopicDrawer } from './EditTopicDrawer';

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
}

export function TopicList({
  topics,
  loading,
  selectedTopic,
  onTopicSelect,
  onCategorySelect,
}: TopicListProps) {
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [isNewCategoryDrawerOpen, setIsNewCategoryDrawerOpen] = useState(false);
  const [selectedTopicForCategory, setSelectedTopicForCategory] = useState<
    string | null
  >(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  const renderTopicActions = (topic: Topic) => (
    <DropdownMenu>
      <DropdownMenu.Trigger className="ml-2">
        <span className="material-icons">more_vert</span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={() => setEditingTopic(topic)}>
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
            <Accordion.Trigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50">
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

      {editingTopic && (
        <EditTopicDrawer
          topic={editingTopic}
          isOpen={!!editingTopic}
          onClose={() => setEditingTopic(null)}
        />
      )}

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
