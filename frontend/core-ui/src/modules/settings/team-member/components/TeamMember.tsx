import { SettingsHeader } from 'erxes-ui';
import { TeamMemberSidebar } from '@/settings/team-member/components/Sidebar';
import { TeamMemberTable } from '@/settings/team-member/components/TeamMemberTable';
import { TeamMemberSettingsBreadcrumb } from '@/settings/team-member/components/TeamMemberSettingsBreadcrumb';
import { TeamMemberTopbar } from '@/settings/team-member/components/TeamMemberTopbar';

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
