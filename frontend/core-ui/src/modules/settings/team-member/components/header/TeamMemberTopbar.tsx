import { useLocation } from 'react-router';
import { TEAM_MEMBER_SETTINGS } from '@/settings/team-member/constants/teamMemberRoutes';
import { InviteTeamMember } from '@/settings/team-member/components/invite/InviteTeamMember';
import { TeamMemberFilter } from '~/modules/settings/team-member/components/header/TeamMemberFilter';

export function TeamMemberTopbar() {
  const { pathname } = useLocation();
  if (pathname === TEAM_MEMBER_SETTINGS) {
    return (
      <div className="ml-auto flex items-center gap-3">
        <TeamMemberFilter />
        <InviteTeamMember />
      </div>
    );
  }
  return null;
}
