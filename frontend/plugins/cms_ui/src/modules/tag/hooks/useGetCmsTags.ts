import { useQuery } from '@apollo/client';
import { useCmsContext } from '~/modules/app/context/CmsContext';
import { CMS_TAGS } from '../graphql/queries/getCmsTags';

export const useGetCmsTags = () => {
  const { selectedWebsite } = useCmsContext();

  const cp_id = selectedWebsite;

  const { data, loading, error } = useQuery(CMS_TAGS, {
    variables: {
      page: 1,
      perPage: 20,
      clientPortalId: cp_id,
    },
  });
  return {
    data: data || [],
    loading,
    error,
  };
};
