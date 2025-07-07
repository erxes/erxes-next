import { useMutation } from '@apollo/client';
import {
  CALL_HISTORY_EDIT,
  CALL_HISTORY_ADD,
} from '../graphql/mutations/callMutations';
import { differenceInSeconds } from 'date-fns';
import { toast } from 'erxes-ui';
import { useAtom, useSetAtom } from 'jotai';
import {
  currentCallConversationIdAtom,
  historyIdAtom,
} from '@/integrations/call/states/callStates';
import { callConfigAtom } from '@/integrations/call/states/sipStates';

export const useMutateCallHistory = () => {
  const [updateHistoryMutation, { loading: updateLoading }] =
    useMutation(CALL_HISTORY_EDIT);
  const [addHistoryMutation, { loading: addLoading }] =
    useMutation(CALL_HISTORY_ADD);

  const [historyId, setHistoryId] = useAtom(historyIdAtom);
  const [config] = useAtom(callConfigAtom);
  const setCurrentCallConversationId = useSetAtom(
    currentCallConversationIdAtom,
  );

  const updateHistory = (
    timeStamp: number,
    callStartTime: Date,
    callEndTime: Date,
    callStatus: string,
    direction?: string,
    customerPhone?: string,
    transferStatus?: string,
    endedBy?: string,
  ) => {
    const transferredCallStatus = localStorage.getItem('transferredCallStatus');
    let duration = 0;
    if (callStartTime && callEndTime) {
      duration = differenceInSeconds(callEndTime, callStartTime);
    }
    if (historyId) {
      updateHistoryMutation({
        variables: {
          id: historyId,
          timeStamp: parseInt(timeStamp.toString()),
          callStartTime,
          callEndTime,
          callDuration: duration,
          callStatus,
          callType: direction,
          customerPhone,
          transferredCallStatus: transferStatus
            ? 'remote'
            : transferredCallStatus,
          endedBy,
        },
        refetchQueries: ['callHistories'],
        onCompleted: () => {
          setHistoryId('');
        },
        onError: (e) => {
          setHistoryId('');

          if (e.message !== 'You cannot edit') {
            toast({
              title: 'Uh oh! Something went wrong.',
              description: e.message,
              variant: 'destructive',
            });
          }
        },
      });
    } else {
      if (callStatus === 'cancelled') {
        updateHistoryMutation({
          variables: {
            timeStamp: parseInt(timeStamp.toString()),
            callStartTime,
            callEndTime,
            callDuration: duration,
            callStatus,
            inboxIntegrationId: config?.inboxId || '',
            customerPhone,
            callType: direction,
            endedBy,
          },
          refetchQueries: ['callHistories'],
          onCompleted: () => {
            setHistoryId('');
          },
          onError: (e) => {
            setHistoryId('');

            if (e.message !== 'You cannot edit') {
              toast({
                title: 'Uh oh! Something went wrong.',
                description: e.message,
                variant: 'destructive',
              });
            }
          },
        });
      } else {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'History id not found',
          variant: 'destructive',
        });
      }
    }
  };

  const addHistory = (
    callStatus: string,
    timeStamp: number,
    direction: string,
    customerPhone: string,
    callStartTime: Date,
    queueName?: string | null,
  ) => {
    addHistoryMutation({
      variables: {
        timeStamp: parseInt(timeStamp.toString()),
        callType: direction,
        callStatus,
        customerPhone,
        inboxIntegrationId: config?.inboxId || '',
        callStartTime,
        queueName,
      },
      onCompleted: ({ callHistoryAdd }) => {
        const callHistoryId = callHistoryAdd?._id;
        const callConversationId = callHistoryAdd?.conversationId;
        setHistoryId(callHistoryId);
        setCurrentCallConversationId(callConversationId);
      },
      onError: (e) => {
        setHistoryId('');

        if (e.message !== 'You cannot edit') {
          toast({
            title: 'Uh oh! Something went wrong.',
            description: e.message,
            variant: 'destructive',
          });
        }
      },
    })
      .then(({ data }: any) => {
        const callHistoryId = data?.callHistoryAdd?._id;
        const callConversationId = data?.callHistoryAdd?.conversationId;
        setHistoryId(callHistoryId);
        setCurrentCallConversationId(callConversationId);

        toast({
          title: 'Successfully updated status',
        });
      })
      .catch((e) => {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: e.message,
          variant: 'destructive',
        });
      });
  };

  return {
    updateHistory,
    addHistory,
    loading: updateLoading || addLoading,
  };
};
