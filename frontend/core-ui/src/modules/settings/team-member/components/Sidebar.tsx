import { Button, Sidebar } from 'erxes-ui';
import { motion } from 'framer-motion';
import { IconPlus } from '@tabler/icons-react';

export function TeamMemberSidebar() {
  return (
    <Sidebar collapsible="none" className="border-r h-screen min-w-[300px]">
      <Sidebar.Header className="py-4 px-3">
        <div className="flex flex-row justify-between items-center px-3">
          <div className="text-xs text-accent-foreground font-semibold">
            User Groups
          </div>
          <Button type="button" variant={'ghost'}>
            <IconPlus size={16} />
          </Button>
        </div>
      </Sidebar.Header>
      <Sidebar.Group>
        <Sidebar.GroupContent>
          <Sidebar.Menu></Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar>
  );
}
