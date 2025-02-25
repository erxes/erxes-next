import React from 'react';

import { Button, ButtonProps, Popover } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib';

import { TagBadges } from '@/tags/components/tagBadges';

import { useSelectTags } from '@/tags/contexts/SelectTagsContext';
import { useTagsByIds } from '@/tags/hooks/useTags';
import { ITag } from '@/tags/types/tagTypes';

export const SelectTagTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  ButtonProps
>(({ className, ...props }, ref) => {
  const { tagType, selectedTagIds, setSelectedTags, selectedTags } =
    useSelectTags();
  useTagsByIds({
    variables: {
      tagType,
      tagIds: selectedTagIds,
    },
    onCompleted: ({ tags }: { tags: ITag[] }) => {
      setSelectedTags(tags);
    },
    skip: !selectedTagIds.length || selectedTags?.length,
  });

  const buttonClasses = cn(
    'justify-start ring-0 overflow-auto gap-1 px-1 min-w-60 font-normal',
    className,
  );

  return (
    <Popover.Trigger asChild>
      <Button variant="ghost" className={buttonClasses} {...props} ref={ref}>
        <TagBadges tagIds={selectedTagIds} tags={selectedTags} />
      </Button>
    </Popover.Trigger>
  );
});
