import { ApolloCache, MutationHookOptions, useMutation } from '@apollo/client';

import { ADD_CHECKLISTS } from '@/deals/graphql/mutations/ChecklistMutations';
import { IChecklist } from '@/deals/types/checklists';
// import { GET_CHECKLISTS } from '@/deals/graphql/queries/ChecklistQueries';

// interface ChecklistData {
//   channels: IChecklist[];
//   channelsTotalCount: number;
// }
type AddChecklistResult = {
  checklistsAdd: IChecklist;
};

export function useChecklistsAdd(
  options?: MutationHookOptions<AddChecklistResult, any>,
) {
  const [checklistsAdd, { loading, error }] = useMutation(ADD_CHECKLISTS, {
    ...options,
    update: (cache: ApolloCache<any>, { data }) => {
      try {
        // const existingData = cache.readQuery<ChecklistData>({
        //   query: GET_CHECKLISTS,
        // });
        // if (!existingData || !existingData.channels || !data?.channelsAdd)
        //   return;
        // cache.writeQuery<ChecklistData>({
        //   query: GET_CHECKLISTS,
        //   data: {
        //     channels: [data.channelsAdd, ...existingData.channels],
        //     channelsTotalCount: existingData.channelsTotalCount + 1,
        //   },
        // });
      } catch (e) {
        console.log('error', e);
      }
    },
  });

  return {
    checklistsAdd,
    loading,
    error,
  };
}
