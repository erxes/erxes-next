import { Accordion, Sidebar, Skeleton } from 'erxes-ui';

import { BoardList } from '@/deals/boards/components/BoardList';
import { PipelineList } from '@/deals/pipelines/components/PipelineList';
import { useBoards } from '@/deals/boards/hooks/useBoards';

export const SalesLeftSidebar = () => {
  const { boards, loading } = useBoards();

  if (loading) {
    return <Skeleton className="w-full flex-1 h-8" />;
  }

  return (
    <Sidebar collapsible="none" className="border-r flex-none">
      <Sidebar.Group>
        <Sidebar.GroupContent>
          <Accordion type="single" collapsible className="w-full">
            <Accordion.Item value="item-1">
              <Accordion.Trigger className="text-gray-400 text-sm">
                Boards
              </Accordion.Trigger>
              <BoardList />
            </Accordion.Item>
          </Accordion>
          <Accordion type="single" collapsible className="w-full">
            <Accordion.Item value="item-1">
              <Accordion.Trigger className="text-gray-400 text-sm">
                Pipelines
              </Accordion.Trigger>
              <PipelineList />
            </Accordion.Item>
          </Accordion>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar>
  );
};
