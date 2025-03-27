import { IconPlus, IconUsersGroup } from '@tabler/icons-react';
import { Button, SettingsHeader } from 'erxes-ui';
import { TeamMemberSidebar } from './Sidebar';
import { TeamMemberTable } from './TeamMemberTable';
import { TeamMemberSettingsBreadcrumb } from './TeamMemberSettingsBreadcrumb';
import { TeamMemberTopbar } from './TeamMemberTopbar';

const TeamMember = () => {
  return (
    <div className="w-full h-full">
      <SettingsHeader breadcrumbs={<TeamMemberSettingsBreadcrumb />}>
        <TeamMemberTopbar />
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
