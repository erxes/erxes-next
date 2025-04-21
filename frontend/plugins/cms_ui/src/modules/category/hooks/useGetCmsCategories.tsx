import { useQuery } from '@apollo/client';
import { useCmsContext } from '~/modules/app/context/CmsContext';
import { CMS_CATEGORIES } from '../graphql/queries/getCmsCategories';

export const useGetCmsCategories = () => {
  const { selectedWebsite } = useCmsContext();

  const cp_id = selectedWebsite;

  const { data, loading, error } = useQuery(CMS_CATEGORIES, {
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
