import { Tooltip } from 'erxes-ui/components';
import { ReactNode } from 'react';

export const MergeToolTip = ({ children, disabled }: { children: ReactNode, disabled: boolean }) => {
  return (
    <Tooltip delayDuration={200} disableHoverableContent={disabled}>
      <Tooltip.Trigger asChild>
        <div className="inline-block">{children}</div>
      </Tooltip.Trigger>
      <Tooltip.Content sideOffset={12}>
        <span>You can only merge 2 contacts</span>
      </Tooltip.Content>
    </Tooltip>
  );
};
