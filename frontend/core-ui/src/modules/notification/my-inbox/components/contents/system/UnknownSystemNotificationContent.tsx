import { IconInfoCircle } from '@tabler/icons-react';

export const UnknownSystemNotificationContent = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="size-36 bg-sidebar rounded-2xl border-2 border-dashed flex items-center justify-center">
        <IconInfoCircle
          size={64}
          className="text-accent-foreground"
          stroke={1}
        />
      </div>
      <div className="text-lg font-semibold mt-5 text-muted-foreground">
        Unknown notification template
      </div>
      <div className=" text-accent-foreground mt-2 max-w-sm text-center">
        The notification type "unknown_template" is not recognized. This may be
        due to a missing template or an outdated notification format.
      </div>
    </div>
  );
};
