import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { recordTableCursorAtomFamily } from '../states/RecordTableCursorState';
export const useRecordTableCursor = ({
  sessionKey,
}: {
  sessionKey?: string;
}) => {
  const [cursor, setCursor] = useAtom(
    recordTableCursorAtomFamily(sessionKey || ''),
  );

  useEffect(() => {
    setCursor(sessionKey ? sessionStorage.getItem(sessionKey) : null);
  }, [sessionKey, setCursor]);

  return {
    cursor,
    setCursor,
  };
};
