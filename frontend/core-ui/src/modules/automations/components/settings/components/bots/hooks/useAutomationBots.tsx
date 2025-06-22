import { AUTOMATIONS_BOTS_CONSTANTS } from '@/automations/components/settings/components/bots/graphql/automationsBotsQueries';
import { gql, useQuery } from '@apollo/client';

export const useAutomationBots = () => {
  const { data, loading } = useQuery(AUTOMATIONS_BOTS_CONSTANTS);

  const { automationBotsConstants = [] } = data || {};

  return {
    automationBotsConstants,
    loading,
  };
};

export const useAutomationBotTotalCount = (queryName: string) => {
  const query = gql`query ${queryName} { ${queryName} }`;

  const { data, loading } = useQuery(query);

  const totalCount = (data || {})[queryName] ?? 0;

  return {
    totalCount,
    loading,
  };
};
