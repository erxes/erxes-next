import { IconUsersGroup } from '@tabler/icons-react';
import { Button, Separator } from 'erxes-ui';
import {
  SETTINGS_ROUTES,
  TEAM_MEMBER_SETTINGS,
} from '@/settings/team-member/constants/teamMemberRoutes';
import { useLocation } from 'react-router';
import { TeamMemberCounts } from '@/settings/team-member/components/TeamMemberCounts';

export function TeamMemberSettingsBreadcrumb() {
  const { pathname } = useLocation();
  return (
    <>
      <Button variant="ghost" className="font-semibold">
        <IconUsersGroup className="w-4 h-4 text-accent-foreground" />
        Team member Settings
      </Button>
      <Separator.Inline />
      <Button variant="ghost" className="hover:bg-transparent font-semibold">
        {SETTINGS_ROUTES[pathname as keyof typeof SETTINGS_ROUTES]}
        {pathname !== TEAM_MEMBER_SETTINGS && (
          <TeamMemberCounts queryKey="departmentId" />
        )}
      </Button>
    </>
  );
}
