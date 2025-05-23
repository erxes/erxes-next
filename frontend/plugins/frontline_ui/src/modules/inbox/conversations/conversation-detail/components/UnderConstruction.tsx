import { IconCrane } from '@tabler/icons-react';

export const UnderConstruction = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="size-36 bg-accent rounded-2xl border-2 border-dashed flex items-center justify-center">
        <IconCrane size={64} className="text-accent-foreground" stroke={1.5} />
      </div>
      <div className="text-xl font-semibold mt-5">Under Construction</div>
      <div className="font-medium text-accent-foreground mt-2">
        Support for this integration is coming soon
      </div>
    </div>
  );
};
