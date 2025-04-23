import { useQueryState } from 'erxes-ui/hooks';
import { useState } from 'react';

export const useRecordTableCursor = ({
  sessionKey,
}: {
  sessionKey?: string;
}) => {
  const [cursor, setCursor] = useQueryState<string | undefined>('cursor');
  const [defaultCursor] = useState<string | undefined>(cursor || undefined);
  const [sessionCursor] = useState<string | undefined>(
    (sessionKey && sessionStorage.getItem(sessionKey)) || undefined,
  );

  return {
    cursor: defaultCursor ? sessionCursor || defaultCursor : undefined,
    setCursor,
    defaultCursor,
    sessionCursor,
  };
};
