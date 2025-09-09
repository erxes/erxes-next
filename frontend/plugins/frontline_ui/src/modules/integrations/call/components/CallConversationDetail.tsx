import { useSetAtom } from 'jotai';
import { CallConversationNotes } from './CallConversationNotes';
import { useEffect } from 'react';
import {
  isInternalState,
  onlyInternalState,
} from '@/inbox/conversations/conversation-detail/states/isInternalState';
import { readImage, useQueryState } from 'erxes-ui';
import { useCallConversationDetail } from '@/integrations/call/hooks/useCallConversationDetail';
import { CustomersInline } from 'ui-modules';
import { useConversationDetail } from '@/inbox/conversations/conversation-detail/hooks/useConversationDetail';
import { format } from 'date-fns';
import { IconPhoneOutgoing, IconPhoneIncoming } from '@tabler/icons-react';
import { formatSeconds } from '@/integrations/call/utils/callUtils';

export function CallConversationDetail() {
  const [conversationId] = useQueryState<string>('conversationId');
  const { conversationDetail, loading } = useConversationDetail({
    variables: {
      _id: conversationId,
    },
    skip: !conversationId,
  });
  const setIsInternalNote = useSetAtom(isInternalState);
  const setOnlyInternal = useSetAtom(onlyInternalState);

  const { callHistoryDetail } = useCallConversationDetail({
    conversationId: conversationId || '',
  });

  useEffect(() => {
    setIsInternalNote(true);
    setOnlyInternal(true);
    return () => {
      setIsInternalNote(false);
      setOnlyInternal(false);
    };
  }, []);

  if (loading || !callHistoryDetail) {
    return null;
  }

  const { callType, callDuration, callStartTime, callEndTime, recordUrl } =
    callHistoryDetail || {};

  return (
    <>
      <div className="flex flex-col max-w-[648px] mx-auto p-6">
        <div className="flex gap-5 items-end">
          <CustomersInline.Provider
            customerIds={[conversationDetail?.customerId || '']}
          >
            <CustomersInline.Avatar size="xl" />
          </CustomersInline.Provider>
          <div className="shadow-xs p-1 rounded-xl max-w-[428px] flex-auto bg-accent">
            <div className="h-8 pb-1 flex items-center gap-2 px-4">
              {callType === 'outgoing' && (
                <IconPhoneOutgoing className="size-4 text-primary" />
              )}
              {callType === 'incoming' && (
                <IconPhoneIncoming className="size-4 text-primary" />
              )}
              <div className="font-medium capitalize">{callType} call</div>
            </div>

            <div className="p-4 bg-background rounded-lg">
              <div className="flex items-center gap-2 justify-between mb-4">
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-accent-foreground">Duration</div>
                  <div className="font-medium">
                    {formatSeconds(callDuration)}
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <div className="text-sm text-accent-foreground">
                    Start Time
                  </div>
                  <div className="font-medium">
                    {format(callStartTime, 'MMM d, yyyy HH:mm')}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-accent-foreground">End Time</div>
                  <div className="font-medium">
                    {format(callEndTime, 'MMM d, yyyy HH:mm')}
                  </div>
                </div>
              </div>
              {recordUrl && (
                <audio controls className="w-full">
                  <source src={readImage(recordUrl)} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </div>
        </div>
      </div>
      <CallConversationNotes />
    </>
  );
}
