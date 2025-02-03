import React from 'react';

import { Avatar, Button, ButtonProps } from 'erxes-ui';

import { IAttachment } from 'erxes-ui/types';

export interface ChipDisplayProps extends ButtonProps {
  attachment: IAttachment;
  colorSeed: string;
  children: string;
}

export const ChipDisplay = React.forwardRef<
  HTMLButtonElement,
  ChipDisplayProps
>(({ attachment, colorSeed, children, ...props }, ref) => {
  return (
    <Button
      variant="secondary"
      size="sm"
      asChild
      className="truncate justify-start"
      {...props}
      ref={ref}
    >
      <div>
        <Avatar>
          <Avatar.Image src={attachment?.url} />
          <Avatar.Fallback colorSeed={colorSeed}>
            {children?.charAt(0)}
          </Avatar.Fallback>
        </Avatar>
        {children}
      </div>
    </Button>
  );
});

ChipDisplay.displayName = 'ChipDisplay';
