import { useLocation } from 'react-router';
import { InviteTeamMember } from '@/settings/team-member/components/invite/InviteTeamMember';
import { TEAM_MEMBER_SETTINGS } from '@/settings/team-member/constants/teamMemberRoutes';

export function TeamMemberTopbar() {
  const { pathname } = useLocation();
  if (pathname === TEAM_MEMBER_SETTINGS) {
    return <InviteTeamMember />;
  }
  return null;
}
