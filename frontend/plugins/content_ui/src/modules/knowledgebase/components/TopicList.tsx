'use client';

import { useMutation } from '@apollo/client';
import { Accordion, DropdownMenu, Spinner, useConfirm } from 'erxes-ui';
import { Ellipsis } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { REMOVE_CATEGORY } from '../graphql/mutations';
import { CategoryDrawer } from './CategoryDrawer';

interface Category {
  _id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  topicId: string;
  parentCategoryId?: string;
  childrens?: Category[];
}

interface Topic {
  _id: string;
  title: string;
  description: string;
  categories: Category[];
}

interface TopicListProps {
  topics: Topic[];
  loading: boolean;
  selectedTopic: string | null;
  onTopicSelect: (topicId: string) => void;
  removeTopic: (topicId: string) => void;
  onEditTopic: (topic: Topic) => void;
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
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(
    undefined,
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { confirm } = useConfirm();

  const [removeCategory] = useMutation(REMOVE_CATEGORY);

  useEffect(() => {
    if (!loading && topics.length > 0) {
      const categoryId = searchParams.get('categoryId');

      if (!categoryId) {
        const firstTopic = topics[0];
        if (firstTopic.categories.length > 0) {
          const firstCategory = firstTopic.categories[0];
          setSearchParams({ categoryId: firstCategory._id });
        }
      }
    }
  }, [loading, topics, searchParams, setSearchParams]);

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

  const handleDeleteCategory = async (category: Category) => {
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

  const handleCategorySelect = (categoryId: string) => {
    setSearchParams({ categoryId });
  };

  const renderCategoryActions = (category: Category) => (
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

  const renderCategoryTree = (categories: Category[]) => {
    const parentCategories = categories.filter((cat) => !cat.parentCategoryId);
    const selectedCategoryId = searchParams.get('categoryId');

    return parentCategories.map((category) => (
      <div key={category._id} className="ml-4">
        <div
          className={`flex items-center justify-between p-2 cursor-pointer rounded`}
        >
          <div
            className="flex-1"
            onClick={() => handleCategorySelect(category._id)}
          >
            <div className="font-medium">{category.title}</div>
            <div className="text-sm text-gray-500">{category.description}</div>
          </div>
          {renderCategoryActions(category)}
        </div>
        {category.childrens && category.childrens.length > 0 && (
          <div className="ml-4">{renderCategoryTree(category.childrens)}</div>
        )}
      </div>
    ));
  };

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
                {renderCategoryTree(topic.categories)}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>

      <CategoryDrawer
        category={editingCategory}
        topicId={selectedTopicForCategory}
        isOpen={isCategoryDrawerOpen}
        onClose={() => {
          setIsCategoryDrawerOpen(false);
          setSelectedTopicForCategory(undefined);
          setEditingCategory(undefined);
        }}
      />
    </div>
  );
}
