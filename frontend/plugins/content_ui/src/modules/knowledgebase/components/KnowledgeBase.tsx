'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { TOPICS } from '../graphql/queries';
import { Button, Sidebar } from 'erxes-ui';
import { TopicList } from './TopicList';
import { ArticleList } from './ArticleList';
import { NewTopicDrawer } from './NewTopicDrawer';

export function KnowledgeBase() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isNewTopicDrawerOpen, setIsNewTopicDrawerOpen] = useState(false);

  const { data: topicsData, loading: topicsLoading } = useQuery(TOPICS, {
    variables: {
      page: 1,
      perPage: 20,
    },
  });

  const topics = topicsData?.knowledgeBaseTopics.list || [];

  return (
    <div className="flex h-full">
      <Sidebar collapsible="none" className="border-r flex-none">
        <Sidebar.Group>
          <Sidebar.GroupLabel>Knowledge Base</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <div className="p-4">
              <Button
                onClick={() => setIsNewTopicDrawerOpen(true)}
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

      <NewTopicDrawer
        isOpen={isNewTopicDrawerOpen}
        onClose={() => setIsNewTopicDrawerOpen(false)}
      />
    </div>
  );
}
