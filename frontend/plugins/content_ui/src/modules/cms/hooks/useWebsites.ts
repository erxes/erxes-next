import { useQuery } from '@apollo/client';
import { GET_WEBSITES } from '../graphql/queries';

export interface Website {
  _id: string;
  name: string;
  description: string;
  domain: string;
  createdAt: string;
  kind: string;
  url: string;
  __typename: string;
}

interface UseWebsitesResult {
  websites: Website[];
  loading: boolean;
  refetch: () => void;
  totalCount: number;
}

export function useWebsites(): UseWebsitesResult {
  const { data, loading, refetch } = useQuery(GET_WEBSITES, {
    variables: {
      search: '',
    },
  });

  const websites = data?.clientPortalGetConfigs?.list || [];
  const totalCount = data?.clientPortalGetConfigs?.totalCount || 0;

  return {
    websites,
    loading,
    refetch,
    totalCount,
  };
}
