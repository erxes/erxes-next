import { IconUserSquare } from '@tabler/icons-react';

export const TeamLine = () => {
  return (
    <div className="w-full flex items-center py-3 px-6 border-b hover:bg-sidebar/50 border-muted-foreground/5 text-sm">
      {/* Title */}
      <div className="w-[40%] sm:w-[50%] xl:w-[50%] flex items-center gap-2">
        <div className="relative">
          <div className="inline-flex size-6 bg-muted/50 items-center justify-center rounded shrink-0">
            <IconUserSquare className="size-4" />
          </div>
        </div>
        <div className="flex flex-col items-start overflow-hidden">
          <span className="font-medium truncate w-full">dsad</span>
        </div>
      </div>

      {/* Members */}
      <div className="w-[20%] sm:w-[20%] xl:w-[20%] pl-2.5">1</div>

      {/* Tasks */}
      <div className="w-[20%] sm:w-[15%] xl:w-[15%] pl-2.5">7</div>

      {/* Created At */}
      <div className="w-[20%] sm:w-[15%] xl:w-[15%] pl-2.5">Sep 2023</div>
    </div>
  );
};
