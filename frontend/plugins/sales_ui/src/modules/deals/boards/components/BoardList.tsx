import { Accordion, Skeleton } from 'erxes-ui';

import { useBoards } from '@/deals/boards/hooks/useBoards';

export const BoardList = () => {
  const { boards, loading } = useBoards();

  if (loading) {
    return <Skeleton className="w-full flex-1 h-8" />;
  }

  return (
    <Accordion.Content className="content">
      {boards?.map((board) => (
        <h3 key={board._id}>{board.name}</h3>
      ))}
    </Accordion.Content>
  );
};
