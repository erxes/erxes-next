import { IconUserFilled, IconUserUp } from '@tabler/icons-react';
import { Button, cn } from 'erxes-ui';
import { ChooseChannel } from '@/inbox/channel/components/ChooseChannel';
import { ChooseIntegrationType } from '@/integrations/components/ChooseIntegrationType';
import { selectMainFilterState } from '@/inbox/states/inboxLayoutState';
import { useAtomValue, useSetAtom } from 'jotai';
import { useQueryState } from 'erxes-ui';
import { currentUserState } from 'ui-modules';
import { Link, useSearchParams } from 'react-router-dom';

export const InboxMainFilter = () => {
  const selectMainFilter = useSetAtom(selectMainFilterState);
  const currentUser = useAtomValue(currentUserState);
  const [assignedTo, setAssignedTo] = useQueryState('assignedTo');
  const [searchParams] = useSearchParams();

  const hasNoSearchParams = [...searchParams].length === 0;

  return (
    <div className="p-3 flex flex-col gap-1 h-full">
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start flex-none',
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
          'w-full justify-start flex-none',
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
      <ChooseIntegrationType />
      <ChooseChannel />
    </div>
  );
};
