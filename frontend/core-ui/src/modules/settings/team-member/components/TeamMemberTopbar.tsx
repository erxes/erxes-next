import { useLocation } from 'react-router';
import { InviteTeamMember } from './invite/InviteTeamMember';

export function TeamMemberTopbar() {
  const { pathname } = useLocation();
  if (pathname === '/settings/team-member') {
    return <InviteTeamMember />;
  }
  return null;
}
