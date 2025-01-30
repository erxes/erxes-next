import React from 'react';

import { Button, ButtonProps, Popover } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';

import { TagBadge } from './TagBadge';

import { useSelectTags } from '@/tags/contexts/SelectTagsContext';
import { useTags } from '@/tags/hooks/useTags';

export const SelectTagTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  ButtonProps
>(({ className, ...props }, ref) => {
  const { tagType, selectedTagIds, setSelectedTags, selectedTags } =
    useSelectTags();
  useTags({
    variables: {
      type: tagType,
      tagIds: selectedTagIds,
    },
    onCompleted: ({ tags }) => {
      setSelectedTags(tags);
    },
    skip: !selectedTagIds.length || selectedTags?.length,
  });

  const buttonClasses = cn(
    'justify-start border-dashed shadow-none ring-0 border overflow-auto gap-1 px-1 min-w-60 font-normal',
    className
  );

  return (
    <Popover.Trigger asChild>
      <Button variant="outline" className={buttonClasses} {...props} ref={ref}>
        {selectedTags?.map((tag) => (
          <TagBadge key={tag._id} {...tag} />
        ))}
      </Button>
    </Popover.Trigger>
  );
});
