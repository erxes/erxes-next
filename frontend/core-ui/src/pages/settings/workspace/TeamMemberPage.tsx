import { TeamMember } from '@/settings/team-member/components/TeamMember';
import { useQueryState } from 'erxes-ui/hooks';
import { MemberDetail } from '@/settings/team-member/details/components/MemberDetail';
import { SettingsHeader } from 'erxes-ui';
import { TeamMemberSettingsBreadcrumb } from '@/settings/team-member/components/TeamMemberSettingsBreadcrumb';
import { TeamMemberTopbar } from '@/settings/team-member/components/header/TeamMemberTopbar';
import { TeamMemberSidebar } from '@/settings/team-member/components/Sidebar';
import { TeamMemberFilterBar } from '@/settings/team-member/components/header/TeamMemberFilterBar';
import { TeamMemberTable } from '@/settings/team-member/components/TeamMemberTable';

export function TeamMemberPage() {
  const [userId] = useQueryState('user_id');
  return (
    <section className="mx-auto flex w-full h-screen relative">
      <TeamMember />
      {!!userId && <MemberDetail />}
    </section>
  );
}
