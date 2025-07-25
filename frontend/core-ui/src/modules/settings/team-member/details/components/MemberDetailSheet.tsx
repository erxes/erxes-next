import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';
import { Button, cn, Sheet } from 'erxes-ui';
import { useSearchParams } from 'react-router-dom';

export const MemberDetailSheet = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = searchParams.get('user_id');

  const setOpen = (newUserId: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (newUserId) {
      newSearchParams.set('user_id', newUserId);
    } else {
      newSearchParams.delete('user_id');
    }
    setSearchParams(newSearchParams);
  };
  return (
    <Sheet
      open={!!userId}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setOpen(null);
        }
      }}
    >
      <Sheet.View
        className={cn(
          'p-0 md:max-w-screen-2xl flex flex-col gap-0 transition-all duration-100 ease-out overflow-hidden flex-none',
          // !!activeTab && 'md:w-[calc(100vw-theme(spacing.4))]',
        )}
      >
        <Sheet.Header className="border-b p-3 flex-row items-center space-y-0 gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setOpen(null);
            }}
          >
            <IconLayoutSidebarLeftCollapse />
          </Button>
          <Sheet.Title>Team Member Detail</Sheet.Title>
          <Sheet.Close />
          <Sheet.Description className="sr-only">
            Team Member Detail
          </Sheet.Description>
        </Sheet.Header>
        <Sheet.Content>{children}</Sheet.Content>
      </Sheet.View>
    </Sheet>
  );
};
