import { Link } from 'react-router';
import { Sidebar } from 'erxes-ui';
import { useBoards } from '@/deals/boards/hooks/useBoards';

export const SalesLeftSidebar = () => {
  const { boards, loading } = useBoards();
  console.log('ccc', boards);
  return (
    <Sidebar collapsible="none" className="border-r flex-none">
      <Sidebar.Group>
        <Sidebar.GroupLabel>Sales Types</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <Link to={`#`}>efefew</Link>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar>
  );
};
