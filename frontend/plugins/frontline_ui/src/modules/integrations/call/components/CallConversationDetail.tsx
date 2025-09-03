import { useSetAtom } from 'jotai';
import { CallConversationNotes } from './CallConversationNotes';
import { useEffect } from 'react';
import { isInternalState } from '@/inbox/conversations/conversation-detail/states/isInternalState';

export function CallConversationDetail() {
  const setIsInternalNote = useSetAtom(isInternalState);
  useEffect(() => {
    setIsInternalNote(true);
    return () => setIsInternalNote(false);
  }, []);
  return <CallConversationNotes />;
}
