import { Filter, SettingsHeader } from 'erxes-ui';
import { TeamMemberSidebar } from '@/settings/team-member/components/Sidebar';
import { TeamMemberTable } from '@/settings/team-member/components/TeamMemberTable';
import { TeamMemberSettingsBreadcrumb } from '@/settings/team-member/components/TeamMemberSettingsBreadcrumb';
import { TeamMemberTopbar } from '@/settings/team-member/components/header/TeamMemberTopbar';
import { TeamMemberFilterBar } from '@/settings/team-member/components/header/TeamMemberFilterBar';

const TeamMember = () => {
  return (
    <Filter id={'team-member-settings'}>
      <div className="w-full h-full">
        <SettingsHeader breadcrumbs={<TeamMemberSettingsBreadcrumb />}>
          <TeamMemberTopbar />
        </SettingsHeader>
        <div className="flex flex-row h-full">
          <TeamMemberSidebar />
          <div className="flex flex-col">
            <TeamMemberFilterBar />
            <div className="flex flex-col h-[calc(100%-64px)] p-5 pb-0">
              <TeamMemberTable />
            </div>
          </div>
        </div>
      </div>
    </Filter>
  );
};

export { TeamMember };
