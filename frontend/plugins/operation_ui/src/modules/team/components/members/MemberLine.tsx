export const MemberLine = () => {
  return (
    <div className="w-full flex items-center py-3 px-6 border-b hover:bg-sidebar/50 border-muted-foreground/5 text-sm">
      <div className="w-[70%] sm:w-[50%] xl:w-[50%] flex items-center gap-2">
        <div className="relative">
          <div className="inline-flex size-6 bg-muted/50 items-center justify-center rounded shrink-0">
            {/* <IconComponent name={icon} /> */}
          </div>
        </div>
        <div className="flex flex-col items-start overflow-hidden">
          <span className="font-medium truncate w-full">admin</span>
        </div>
      </div>

      <div className="w-[30%] sm:w-[20%] xl:w-[20%] pl-2.5 text-right">
        dada
      </div>
    </div>
  );
};
