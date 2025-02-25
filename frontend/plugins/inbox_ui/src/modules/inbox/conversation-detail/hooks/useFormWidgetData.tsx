import { OperationVariables, useQuery } from '@apollo/client';
import { FORM_WIDGET_DATA } from '../graphql/queries/getFormWidgetData';

export const useFormWidgetData = (options: OperationVariables) => {
  const { data, loading } = useQuery(FORM_WIDGET_DATA, options);

  console.log(data);
  return {
    conversationMessages: data?.conversationMessages,
    loading,
  };
};
