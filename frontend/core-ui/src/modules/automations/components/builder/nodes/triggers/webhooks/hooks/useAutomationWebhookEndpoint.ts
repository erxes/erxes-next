import { GET_AUTOMATION_WEBHOOK_ENDPOINT } from '@/automations/graphql/automationQueries';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router';

type QueryResponse = {
  getAutomationWebhookEndpoint: string;
};

export const useAutomationWebhookEndpoint = () => {
  const { id } = useParams();
  console.log({ id });
  const { data, loading } = useQuery<QueryResponse>(
    GET_AUTOMATION_WEBHOOK_ENDPOINT,
    { variables: { id } },
  );

  console.log({ data, loading });

  return {
    endpoint: data?.getAutomationWebhookEndpoint,
    loading,
  };
};
