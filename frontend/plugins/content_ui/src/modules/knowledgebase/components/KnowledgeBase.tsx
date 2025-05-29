'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import { TOPICS } from '../graphql/queries';
import { REMOVE_TOPIC } from '../graphql/mutations';
import { Button, Sidebar } from 'erxes-ui';
import { TopicList } from './TopicList';
import { ArticleList } from './ArticleList';
import { TopicDrawer } from './TopicDrawer';
import { ArticleDrawer } from './ArticleDrawer';
import { Category, Topic, TopicResponse } from '../types';

function convertToTopic(response: TopicResponse): Topic {
  return {
    _id: response._id,
    title: response.title,
    code: response.code || '',
    description: response.description || '',
    brandId: '', // Default value since it's not in the response
    color: response.color || '',
    backgroundImage: response.backgroundImage || '',
    languageCode: response.languageCode || '',
    notificationSegmentId: response.notificationSegmentId || '',
    categories: response.categories,
    createdBy: response.createdBy,
    createdDate: response.createdDate,
    modifiedBy: response.modifiedBy,
    parentCategories: response.parentCategories,
  };
}

export function KnowledgeBase() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isTopicDrawerOpen, setIsTopicDrawerOpen] = useState(false);
  const [isArticleDrawerOpen, setIsArticleDrawerOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | undefined>(
    undefined,
  );
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const {
    data: topicsData,
    loading: topicsLoading,
    refetch,
  } = useQuery(TOPICS, {
    variables: {
      page: 1,
      perPage: 20,
    },
    fetchPolicy: 'network-only',
  });

  const [removeTopic] = useMutation(REMOVE_TOPIC);

  const topics = (topicsData?.knowledgeBaseTopics.list || []).map(
    convertToTopic,
  );
  const selectedCategoryId = searchParams.get('categoryId');

  useEffect(() => {
    if (selectedCategoryId && topics.length > 0) {
      const category = topics
        .flatMap((topic: Topic) => topic.categories || [])
        .find((cat: Category) => cat._id === selectedCategoryId);

      if (category) {
        setCurrentCategory(category);
      }
    }
  }, [selectedCategoryId, topics]);

  const handleCloseTopicDrawer = () => {
    setIsTopicDrawerOpen(false);
    setEditingTopic(undefined);
  };

  const handleCloseArticleDrawer = () => {
    setIsArticleDrawerOpen(false);
    setEditingArticle(null);
  };

  return (
    <div className="flex h-full">
      <Sidebar collapsible="none" className="border-r flex-none">
        <Sidebar.Group>
          <Sidebar.GroupLabel>Knowledge Base</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <div className="p-4">
              <Button
                onClick={() => setIsTopicDrawerOpen(true)}
                className="w-full"
              >
                New Topic
              </Button>
            </div>
            <TopicList
              topics={topics}
              loading={topicsLoading}
              selectedTopic={selectedTopic}
              onTopicSelect={setSelectedTopic}
              removeTopic={(_id) =>
                removeTopic({
                  variables: {
                    _id,
                  },
                }).then(() => {
                  refetch();
                })
              }
              onEditTopic={(topic) => {
                setEditingTopic(topic);
                setIsTopicDrawerOpen(true);
              }}
            />
          </Sidebar.GroupContent>
        </Sidebar.Group>
      </Sidebar>

      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {selectedCategoryId
              ? 'Articles in ' + currentCategory?.title
              : 'Select a category to view articles'}
          </h2>
          {selectedCategoryId && (
            <Button onClick={() => setIsArticleDrawerOpen(true)}>
              New Article
            </Button>
          )}
        </div>

        {selectedCategoryId && (
          <ArticleList
            categoryId={selectedCategoryId}
            onEditArticle={(article) => {
              setEditingArticle(article);
              setIsArticleDrawerOpen(true);
            }}
          />
        )}
      </div>

      <TopicDrawer
        topic={editingTopic}
        isOpen={isTopicDrawerOpen}
        onClose={handleCloseTopicDrawer}
      />

      <ArticleDrawer
        article={editingArticle}
        categoryId={selectedCategoryId || ''}
        isOpen={isArticleDrawerOpen}
        onClose={handleCloseArticleDrawer}
      />
    </div>
  );
}
