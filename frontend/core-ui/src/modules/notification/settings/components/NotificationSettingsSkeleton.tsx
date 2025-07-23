import { useNotificationsSettingsContext } from '@/notification/settings/context/NotificationSettingsContext';
import { cn, Label, Separator, Skeleton } from 'erxes-ui';

export const NotificationSettingsSkeleton = () => {
  const { isOrgConfig } = useNotificationsSettingsContext();
  return (
    <div className="w-full mx-auto max-w-3xl mb-6 pt-10">
      <div>
        <h2 className="font-semibold text-lg">My Notification Settings</h2>
        <span className="text-accent-foreground text-xs ">
          Select push and email notifications you'd like to receive
        </span>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between items-center text-accent-foreground">
        <div className="flex flex-col">
          <Label className={cn('text-md')}>Enable all notifications</Label>
          <span className="text-accent-foreground text-xs ">
            Turn on/off all notification channels
          </span>
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex gap-2 items-center py-2">
            <Skeleton className="h-6 w-12" />
          </div>
          <div className="flex gap-2 items-center py-2">
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      </div>
      {isOrgConfig && (
        <>
          <Label>Notification expires after days</Label>
          <Skeleton className="h-8 w-full my-4" />
        </>
      )}
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index}>
          <Skeleton className="h-6 w-1/5" />
          <div className="flex flex-row w-full py-2">
            <Skeleton className="flex gap-2 mt-2 h-6 w-1/5" />
            <div className="px-4 w-4/5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="flex flex-row justify-between py-2" key={index}>
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
