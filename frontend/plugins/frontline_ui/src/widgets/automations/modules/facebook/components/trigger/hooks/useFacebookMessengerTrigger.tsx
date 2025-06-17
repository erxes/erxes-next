import { gql, useQuery } from '@apollo/client';

const AUTOMATION_CONSTANTS = gql`
  query AutomationConstants {
    automationConstants
  }
`;

export const useFacebookMessengerTrigger = () => {
  const { data, loading } = useQuery(AUTOMATION_CONSTANTS, {
    fetchPolicy: 'no-cache',
  });

  const { conditions = [] } =
    data?.automationConstants?.triggersConst.find(
      ({ type }: any) => 'frontline:facebook.messages' === type,
    ) || {};

  return {
    conditions,
    loading,
  };
};
