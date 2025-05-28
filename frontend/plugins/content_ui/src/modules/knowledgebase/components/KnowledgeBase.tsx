'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { TOPICS } from '../graphql/queries';
import { REMOVE_TOPIC } from '../graphql/mutations';
import { Button, Sidebar } from 'erxes-ui';
import { TopicList } from './TopicList';
import { ArticleList } from './ArticleList';
import { TopicDrawer } from './TopicDrawer';

export function KnowledgeBase() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isTopicDrawerOpen, setIsTopicDrawerOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<any>(null);

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

  const handleCloseTopicDrawer = () => {
    setIsTopicDrawerOpen(false);
    setEditingTopic(null);
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
              onCategorySelect={setSelectedCategory}
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
            {selectedCategory
              ? 'Articles'
              : 'Select a category to view articles'}
          </h2>
          {selectedCategory && <Button>New Article</Button>}
        </div>

        {selectedCategory && <ArticleList categoryId={selectedCategory} />}
      </div>

      <TopicDrawer
        topic={editingTopic}
        isOpen={isTopicDrawerOpen}
        onClose={handleCloseTopicDrawer}
      />
    </div>
  );
}
