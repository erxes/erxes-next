import { Popover } from 'erxes-ui/components';
import { usePreviousHotkeyScope } from '../hooks/usePreviousHotkeyScope';

export const PopoverScoped = ({
  scope,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof Popover.Root> & {
  scope?: string;
}) => {
  const {
    setHotkeyScopeAndMemorizePreviousScope,
    goBackToPreviousHotkeyScope,
  } = usePreviousHotkeyScope();

  return (
    <Popover
      {...props}
      onOpenChange={(open) => {
        onOpenChange?.(open);
        if (scope) {
          open
            ? setHotkeyScopeAndMemorizePreviousScope(scope + '.Popover')
            : goBackToPreviousHotkeyScope();
        }
      }}
    />
  );
};
