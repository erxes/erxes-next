import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';
import { Button, cn, Sheet } from 'erxes-ui';
import { useQueryState } from 'erxes-ui/hooks';
import { useSearchParams } from 'react-router-dom';

export const MemberDetailSheet = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = searchParams.get('user_id');

  const setOpen = (newProductId: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (newProductId) {
      newSearchParams.set('user_id', newProductId);
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
      <Sheet.Content
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
        {children}
      </Sheet.Content>
    </Sheet>
  );
};
