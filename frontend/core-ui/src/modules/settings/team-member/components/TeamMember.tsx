import { Filter } from 'erxes-ui';
import { TeamMemberSidebar } from '@/settings/team-member/components/Sidebar';
import { TeamMemberTable } from '@/settings/team-member/components/TeamMemberTable';
import { TeamMemberSettingsBreadcrumb } from '@/settings/team-member/components/TeamMemberSettingsBreadcrumb';
import { TeamMemberTopbar } from '@/settings/team-member/components/header/TeamMemberTopbar';
import { TeamMemberFilterBar } from '@/settings/team-member/components/header/TeamMemberFilterBar';
import { SettingsHeader } from 'ui-modules';

export const TeamMember = () => {
  return (
    <Filter id={'team-member-settings'}>
      <div className="w-full h-full">
        <SettingsHeader breadcrumbs={<TeamMemberSettingsBreadcrumb />}>
          <TeamMemberTopbar />
        </SettingsHeader>
        <div className="flex flex-row h-full w-full">
          <TeamMemberSidebar />
          <div className="flex flex-col w-full h-full px-5">
            <TeamMemberFilterBar />
            <div className="flex w-full h-full">
              <TeamMemberTable />
            </div>
          </div>
        </div>
      </div>
    </Filter>
  );
};
