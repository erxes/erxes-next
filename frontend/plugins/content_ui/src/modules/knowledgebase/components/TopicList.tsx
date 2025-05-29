'use client';

import { useMutation } from '@apollo/client';
import {
  Collapsible,
  DropdownMenu,
  Sidebar,
  Spinner,
  useConfirm,
} from 'erxes-ui';
import { ChevronDown, ChevronUp, Ellipsis } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { REMOVE_CATEGORY } from '../graphql/mutations';
import { ICategory, ITopic } from '../types';

interface TopicListProps {
  topics: ITopic[];
  loading: boolean;
  selectedTopic: string | null;
  onTopicSelect: (topicId: string) => void;
  removeTopic: (topicId: string) => void;
  onEditTopic: (topic: ITopic) => void;
}

export function TopicList({
  topics,
  loading,
  selectedTopic,
  onTopicSelect,
  removeTopic,
  onEditTopic,
}: TopicListProps) {
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [selectedTopicForCategory, setSelectedTopicForCategory] = useState<
    string | undefined
  >(undefined);
  const [editingCategory, setEditingCategory] = useState<ICategory | undefined>(
    undefined,
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { confirm } = useConfirm();

  const [removeCategory] = useMutation(REMOVE_CATEGORY);

  useEffect(() => {
    if (!loading && topics.length > 0) {
      const topicId = searchParams.get('topicId');

      const firstTopic = topics[0];

      const newParams: Record<string, string> = {};

      if (!topicId && firstTopic) {
        newParams.topicId = firstTopic._id;
      }

      if (Object.keys(newParams).length > 0) {
        setSearchParams((prev) => {
          const updated = new URLSearchParams(prev.toString());
          Object.entries(newParams).forEach(([key, value]) =>
            updated.set(key, value),
          );
          return updated;
        });
      }
    }
  }, [loading, searchParams, setSearchParams, topics]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  const handleDeleteTopic = async (topic: ITopic) => {
    const categoryCount = topic.categories?.length || 0;
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

  const handleDeleteCategory = async (category: ICategory) => {
    const message = `Are you sure you want to delete "${category.title}"? This will also delete all associated articles. This action cannot be undone.`;

    const confirmOptions = {
      confirmationValue: 'delete',
      description: 'This action is permanent and cannot be undone.',
    };

    try {
      await confirm({
        message,
        options: confirmOptions,
      });

      await removeCategory({
        variables: {
          _id: category._id,
        },
      });
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const renderCategoryActions = (category: ICategory) => (
    <DropdownMenu>
      <DropdownMenu.Trigger className="ml-2 p-2">
        <Ellipsis className="w-4 h-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item
          onClick={() => {
            setEditingCategory(category);
            setIsCategoryDrawerOpen(true);
          }}
        >
          Edit Category
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onClick={() => {
            setSelectedTopicForCategory(category.topicId);
            setIsCategoryDrawerOpen(true);
          }}
        >
          Add Subcategory
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          onClick={() => handleDeleteCategory(category)}
          className="text-red-600"
        >
          Delete Category
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );

  const renderTopicActions = (topic: ITopic) => (
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
            setIsCategoryDrawerOpen(true);
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
    <Sidebar.Menu>
      {topics.map((topic) => (
        <Sidebar.MenuItem key={topic._id}>
          <Sidebar.MenuButton
            isActive={topic._id === searchParams.get('topicId')}
          >
            <div
              className="flex items-center justify-between w-full"
              onClick={() => navigate(`?topicId=${topic._id}`)}
            >
              <Collapsible
                key={topic._id}
                open={topic._id === searchParams.get('topicId')}
              >
                <Collapsible.Trigger>
                  <span>{topic.title}</span>
                </Collapsible.Trigger>
                {topic.parentCategories &&
                  topic.parentCategories.length > 0 && (
                    <Collapsible.Content className="overflow-hidden transition-[max-height] duration-300 ease-in-out">
                      {topic.parentCategories.map((category) => {
                        return (
                          <div key={category._id}>
                            <span>{category.title}</span>
                          </div>
                        );
                      })}
                    </Collapsible.Content>
                  )}
              </Collapsible>
            </div>
            {renderTopicActions(topic)}
            {topic._id === searchParams.get('topicId') ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      ))}
    </Sidebar.Menu>
  );
}
