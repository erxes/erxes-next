import { useLocation } from 'react-router';
import { InviteTeamMember } from './invite/InviteTeamMember';
import { TEAM_MEMBER_SETTINGS } from '../constants/teamMemberRoutes';

export function TeamMemberTopbar() {
  const { pathname } = useLocation();
  if (pathname === TEAM_MEMBER_SETTINGS) {
    return <InviteTeamMember />;
  }
  return null;
}
