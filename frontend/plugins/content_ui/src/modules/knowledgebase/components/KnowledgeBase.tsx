'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import { TOPICS } from '../graphql/queries';
import { REMOVE_TOPIC } from '../graphql/mutations';
import { Button, Sidebar } from 'erxes-ui';
import { TopicList } from './TopicList';
import { ArticleList } from './ArticleList';
import { TopicDrawer } from './TopicDrawer';
import { ArticleDrawer } from './ArticleDrawer';

export function KnowledgeBase() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isTopicDrawerOpen, setIsTopicDrawerOpen] = useState(false);
  const [isArticleDrawerOpen, setIsArticleDrawerOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<any>(null);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [searchParams] = useSearchParams();

  const {
    data: topicsData,
    loading: topicsLoading,
    refetch,
  } = useQuery(TOPICS, {
    variables: {
      page: 1,
      perPage: 20,
    },
  });

  const [removeTopic] = useMutation(REMOVE_TOPIC);

  const topics = topicsData?.knowledgeBaseTopics.list || [];
  const selectedCategoryId = searchParams.get('categoryId');

  const handleCloseTopicDrawer = () => {
    setIsTopicDrawerOpen(false);
    setEditingTopic(null);
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
              ? 'Articles'
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
        categoryId={selectedCategoryId || undefined}
        isOpen={isArticleDrawerOpen}
        onClose={handleCloseArticleDrawer}
      />
    </div>
  );
}
