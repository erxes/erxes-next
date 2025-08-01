import { IconUserSquare } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { SettingsHeader } from 'ui-modules';
import { Teams } from '@/team/components/team-list/Teams';
import { CreateTeam } from '@/team/components/team-list/CreateTeam';

export const TeamsSettingsPage = () => {
  return (
    <>
      <SettingsHeader
        breadcrumbs={
          <Button variant="ghost" className="font-semibold">
            <IconUserSquare className="w-4 h-4 text-accent-foreground" />
            Teams
          </Button>
        }
      >
        <div className="ml-auto">
          <CreateTeam />
        </div>
      </SettingsHeader>

      <Teams />
    </>
  );
};
