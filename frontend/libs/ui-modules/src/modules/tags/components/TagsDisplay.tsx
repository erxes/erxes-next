import { Button, InlineCellDisplay, cn } from 'erxes-ui';
import React, { memo } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { useSelectTagsContext } from '../hooks/useSelectTagsContext';
import { SingleTagWithTooltip } from './SingleTagWithTooltip';
import { TagBadgeList } from './TagBadgeList';

interface TagsDisplayProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  showAddButton?: boolean;
}

export const TagsDisplay = memo(
  React.forwardRef<React.ElementRef<typeof Button>, TagsDisplayProps>(
    ({ showAddButton, className, ...props }, ref) => {
      const { asTrigger } = useSelectTagsContext();

      return (
        <InlineCellDisplay
          className={cn('w-full h-cell relative group', className)}
          ref={ref}
          variant={asTrigger ? 'secondary' : 'ghost'}
          {...props}
        >
          {asTrigger ? <SingleTagWithTooltip /> : <TagBadgeList />}
          {showAddButton && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-1 size-5 px-0 hidden items-center hover:bg-border justify-center group-hover:flex"
            >
              <IconPlus className="text-muted-foreground" />
            </Button>
          )}
        </InlineCellDisplay>
      );
    },
  ),
);

TagsDisplay.displayName = 'TagsDisplay';
