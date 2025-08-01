import { IconComponent } from 'erxes-ui';
import { ITeam } from '@/team/types';
import { format } from 'date-fns';

export const TeamLine = ({ team }: { team: ITeam }) => {
  return (
    <div className="w-full flex items-center py-3 px-6 border-b hover:bg-sidebar/50 border-muted-foreground/5 text-sm">
      <div className="w-[40%] sm:w-[50%] xl:w-[50%] flex items-center gap-2">
        <div className="relative">
          <div className="inline-flex size-6 bg-muted/50 items-center justify-center rounded shrink-0">
            <IconComponent name={team.icon} />
          </div>
        </div>
        <div className="flex flex-col items-start overflow-hidden">
          <span className="font-medium truncate w-full">{team.name}</span>
        </div>
      </div>

      <div className="w-[20%] sm:w-[20%] xl:w-[20%] pl-2.5">
        {team.memberIds.length}
      </div>

      <div className="w-[20%] sm:w-[15%] xl:w-[15%] pl-2.5">
        {team.taskCount}
      </div>

      <div className="w-[20%] sm:w-[15%] xl:w-[15%] pl-2.5">
        {format(team.createdAt, 'MMM d, yyyy')}
      </div>
    </div>
  );
};
