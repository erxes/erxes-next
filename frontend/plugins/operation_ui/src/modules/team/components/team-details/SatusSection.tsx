import { IconChevronRight } from '@tabler/icons-react';
import { ITeam } from '@/team/types';

export const StatusSection = ({ team }: { team: ITeam }) => {
  return (
    <div className="mt-4 w-full border border-muted-foreground/15 rounded-md hover:bg-sidebar/50 cursor-pointer">
      <section className="w-full p-4">
        <div className="flex items-center justify-between">
          <p>Task statuses</p>

          <div className="flex items-center gap-2">
            {/* <p className="text-xs">{team.status}</p> */}
            <IconChevronRight className="w-4 h-4" />
            {/* <Popover>
          <Popover.Trigger asChild>
            <IconEdit />
          </Popover.Trigger>
          <Combobox.Content className="w-[120px]">
            <Command shouldFilter={false}>
              <Command.List>
                <Command.Item value="edit">
                  <IconEdit /> Edit
                </Command.Item>
              </Command.List>
            </Command>
          </Combobox.Content>
        </Popover> */}
          </div>
        </div>
      </section>
    </div>
  );
};
