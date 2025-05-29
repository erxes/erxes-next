import { useQuery } from '@apollo/client';
import { TOPICS } from '../graphql/queries';

const ITEMS_PER_PAGE = 10;

export interface Topic {
  _id: string;
  title: string;
  code: string;
  description: string;
  brandId: string;
  brand: {
    _id: string;
    name: string;
  };
  categories: Category[];
  color: string;
  backgroundImage: string;
  languageCode: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  notificationSegmentId: string;
  parentCategories: ParentCategory[];
}

export interface Category {
  _id: string;
  title: string;
  description: string;
  icon: string;
  topicId: string;
  parentCategoryId?: string;
  children?: Category[];
}

export interface ParentCategory {
  _id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  numOfArticles: number;
  authors: {
    _id: string;
    details: {
      fullName: string;
      avatar: string;
    };
  }[];
}

interface UseTopicsResult {
  topics: Topic[];
  loading: boolean;
  hasMore: boolean;
  endCursor: string | null;
  loadMore: () => Promise<void>;
  totalCount: number;
}

export function useTopics(): UseTopicsResult {
  const { data, loading, fetchMore } = useQuery(TOPICS, {
    variables: {
      limit: ITEMS_PER_PAGE,
      cursor: null,
      direction: 'forward',
    },
  });

  const topics = data?.knowledgeBaseTopics?.list || [];
  const hasMore = data?.knowledgeBaseTopics?.pageInfo?.hasNextPage || false;
  const endCursor = data?.knowledgeBaseTopics?.pageInfo?.endCursor || null;
  const totalCount = data?.knowledgeBaseTopics?.totalCount || 0;

  const loadMore = async () => {
    if (!endCursor) return;

    try {
      await fetchMore({
        variables: {
          limit: ITEMS_PER_PAGE,
          cursor: endCursor,
          direction: 'forward',
        },
      });
    } catch (error) {
      console.error('Error loading more topics:', error);
    }
  };

  return {
    topics,
    loading,
    hasMore,
    endCursor,
    loadMore,
    totalCount,
  };
}
