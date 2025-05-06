import { useState } from 'react';

export const useRecordTableCursor = ({
  sessionKey,
}: {
  sessionKey?: string;
}) => {
  const [sessionCursor] = useState<string | undefined>(
    (sessionKey && sessionStorage.getItem(sessionKey)) || undefined,
  );

  return {
    cursor: sessionCursor,
  };
};
