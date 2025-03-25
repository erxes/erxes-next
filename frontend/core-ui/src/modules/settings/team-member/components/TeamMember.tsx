import { IconPlus, IconUsersGroup } from '@tabler/icons-react';
import { Button, SettingsHeader } from 'erxes-ui';
import { TeamMemberSidebar } from './Sidebar';
import { TeamMemberTable } from './TeamMemberTable';

const TeamMember = () => {
  return (
    <div className="w-full h-full">
      <SettingsHeader>
        <Button variant="ghost" className="font-semibold">
          <IconUsersGroup
            size={16}
            className="text-accent-foreground stroke-2"
          />
          Team Member
        </Button>
        <div className="flex items-center gap-4 ml-auto">
          <Button type="button">
            <IconPlus />
            Invite team members
          </Button>
        </div>
      </SettingsHeader>
      <div className="flex flex-row h-full">
        <TeamMemberSidebar />
        <div className="flex overflow-x-scroll flex-col h-[calc(100%-64px)] p-5">
          <TeamMemberTable />
        </div>
      </div>
    </div>
  );
};

export { TeamMember };
