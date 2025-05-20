import { useQuery } from '@apollo/client';
import { Spinner } from 'erxes-ui/components';
import { useParams } from 'react-router';
import Detail from '~/modules/app/components/editor';
import queries from '~/modules/app/graphql/queries';
import { IAutomation } from '~/modules/app/types';

export const Page = (...props: any) => {
  const { id } = useParams();

  const { data, loading } = useQuery<{ automationDetail: IAutomation }>(
    queries.detail,
    {
      variables: { id },
      skip: !id,
    },
  );

  if (loading) {
    return <Spinner />;
  }

  const detail = data?.automationDetail;

  return <Detail detail={detail} />;
};
