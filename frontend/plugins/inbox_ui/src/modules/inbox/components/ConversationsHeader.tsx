import { Button } from 'erxes-ui/components';
import { IconArrowLeft, IconUsers } from '@tabler/icons-react';
import { useQueryState } from '../hooks/useQueryState';

export const ConversationsHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [detailView, setDetailView] = useQueryState<boolean>('detailView');

  if (!detailView) return <div className="pl-4 pr-4 py-3">{children}</div>;

  return (
    <div className="pl-6 pr-4 py-3">
      <Button
        variant="ghost"
        className="text-muted-foreground w-full justify-start mb-5 px-2"
        onClick={() => setDetailView(false)}
      >
        <IconArrowLeft />
        <span>Back to channels</span>
      </Button>
      <Button variant="ghost" className="w-full justify-start mb-1 px-2">
        <IconUsers />
        <span>Team Inbox</span>
      </Button>
      {children}
    </div>
  );
};
