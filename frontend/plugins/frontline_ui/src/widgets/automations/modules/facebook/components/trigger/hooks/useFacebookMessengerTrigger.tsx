import { gql, useQuery } from '@apollo/client';

const AUTOMATION_CONSTANTS = gql`
  query AutomationConstants {
    automationConstants
  }
`;

type ICondition = {
  type: string;
  label: string;
  icon: string;
  description: string;
};

export const useFacebookMessengerTrigger = () => {
  const { data, loading } = useQuery(AUTOMATION_CONSTANTS, {
    fetchPolicy: 'cache-first',
  });

  const { conditions = [] } =
    data?.automationConstants?.triggersConst.find(
      ({ type }: any) => 'frontline:facebook.messages' === type,
    ) || {};

  return {
    triggerConditionsConstans: conditions as ICondition[],
    loading,
  };
};
