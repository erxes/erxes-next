import { useSetAtom } from 'jotai';
import { CallConversationNotes } from './CallConversationNotes';
import { useEffect } from 'react';
import {
  isInternalState,
  onlyInternalState,
} from '@/inbox/conversations/conversation-detail/states/isInternalState';

export function CallConversationDetail() {
  const setIsInternalNote = useSetAtom(isInternalState);
  const setOnlyInternal = useSetAtom(onlyInternalState);
  useEffect(() => {
    setIsInternalNote(true);
    setOnlyInternal(true);
    return () => {
      setIsInternalNote(false);
      setOnlyInternal(false);
    };
  }, []);
  return <CallConversationNotes />;
}
