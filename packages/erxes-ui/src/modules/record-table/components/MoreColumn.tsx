import React from 'react';

import { IconDots } from '@tabler/icons-react';

import { Button, ButtonProps } from 'erxes-ui/components';

export const RecordTableMoreButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <Button ref={ref} variant="ghost" size="icon" {...props}>
      <IconDots className="text-muted-foreground" />
    </Button>
  );
});