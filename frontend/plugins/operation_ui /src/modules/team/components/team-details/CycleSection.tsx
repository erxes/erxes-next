export const CycleSection = () => {
  return (
    <div className="mt-4 w-full border border-muted-foreground/15 rounded-md hover:bg-sidebar/50 cursor-pointer">
      <section className="w-full p-4">
        <div className="flex items-center justify-between">
          <p>Cycle</p>

          <div className="flex items-center gap-2">
            <p className="text-xs">Under development</p>
            {/* <IconChevronRight className="w-4 h-4" /> */}
            {/* <Popover>
          <Popover.Trigger asChild>
            <IconEdit />
          </Popover.Trigger>
          <Combobox.Content className="w-[120px]">
            <Command shouldFilter={false}>
              <Command.List>
                <Command.Item value="edit">
                  <IconEdit /> Edit
                </Command.Item>
              </Command.List>
            </Command>
          </Combobox.Content>
        </Popover> */}
          </div>
        </div>
      </section>
    </div>
  );
};
