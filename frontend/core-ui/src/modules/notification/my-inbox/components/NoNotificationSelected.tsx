import { IconCircleMinus } from '@tabler/icons-react';

export const NoNotificationSelected = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="size-36 bg-sidebar rounded-2xl border-2 border-dashed flex items-center justify-center">
        <IconCircleMinus
          size={64}
          className="text-accent-foreground"
          stroke={1}
        />
      </div>
      <div className="text-lg font-semibold mt-5 text-muted-foreground">
        No notification selected
      </div>
      <div className=" text-accent-foreground mt-2">
        Please select a notification to view its details.
      </div>
    </div>
  );
};
