import { IconUserFilled, IconUserUp } from '@tabler/icons-react';
import { Button, cn, ScrollArea } from 'erxes-ui';
import { ChooseChannel } from '@/inbox/channel/components/ChooseChannel';
import { ChooseIntegrationType } from '@/integrations/components/ChooseIntegrationType';
import { selectMainFilterState } from '@/inbox/states/inboxLayoutState';
import { useAtomValue, useSetAtom } from 'jotai';
import { useQueryState } from 'erxes-ui';
import { currentUserState } from 'ui-modules';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

export const InboxMainFilter = () => {
  const selectMainFilter = useSetAtom(selectMainFilterState);
  const currentUser = useAtomValue(currentUserState);
  const [assignedTo, setAssignedTo] = useQueryState('assignedTo');
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const hasNoSearchParams = [...searchParams].length === 0;

  return (
    <ScrollArea className="h-full" viewportClassName="block-child">
      <div className="p-4 flex flex-col gap-1">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            hasNoSearchParams && 'bg-muted',
          )}
          onClick={() => selectMainFilter()}
          asChild
        >
          <Link to="/inbox">
            <IconUserFilled className="text-accent-foreground" />
            All conversations
          </Link>
        </Button>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            assignedTo === currentUser?._id && 'bg-muted',
          )}
          onClick={() => {
            setAssignedTo(currentUser?._id || '');
            selectMainFilter();
          }}
        >
          <IconUserUp className="text-accent-foreground" />
          Assigned to me
        </Button>
        <ChooseChannel />
        <ChooseIntegrationType />
      </div>
    </ScrollArea>
  );
};
