import { TeamInboxMenu } from '~/modules/sidebar/components/TeamInboxMenu';

export const InboxSidebar = () => {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto">
      <TeamInboxMenu />
    </div>
  );
};
