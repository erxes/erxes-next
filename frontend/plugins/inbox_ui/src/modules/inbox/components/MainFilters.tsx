import { IconUsers, IconUserUp } from '@tabler/icons-react';
import { Button, Collapsible } from 'erxes-ui/components';
import { ChooseChannel } from '@/inbox/components/ChooseChannel';
import { ChooseIntegration } from '@/inbox/components/ChooseIntegration';
import { Link } from 'react-router-dom';
import { useQueryState } from '../hooks/useQueryState';

export const MainFilters = () => {
  const [assignedToMe, setAssignedToMe] =
    useQueryState<boolean>('assignedToMe');
  const [detailView, setDetailView] = useQueryState<boolean>('detailView');

  return (
    <Collapsible
      className="group/collapsible flex flex-col gap-1 py-4 px-2"
      defaultOpen
    >
      <Collapsible.TriggerButton>
        <Collapsible.TriggerIcon className="group-data-[state=open]/collapsible:rotate-180" />
        Team Inbox
      </Collapsible.TriggerButton>
      <Collapsible.Content className="pl-4 flex flex-col gap-1">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setDetailView(true)}
        >
          <IconUsers className="text-accent-foreground" />
          Team Inbox
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/inbox?assignedToMe=true">
            <IconUserUp className="text-accent-foreground" />
            Assigned to me
          </Link>
        </Button>
        <ChooseChannel />
        <ChooseIntegration />
      </Collapsible.Content>
    </Collapsible>
  );
};
