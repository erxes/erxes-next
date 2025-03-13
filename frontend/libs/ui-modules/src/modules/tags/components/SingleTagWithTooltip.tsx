import { Combobox, Tooltip } from 'erxes-ui';
import { TagBadge } from './TagBadge';
import { useSelectTagsContext } from '../hooks/useSelectTagsContext';
import React from 'react';
export const SingleTagWithTooltip = React.forwardRef<
  React.ElementRef<typeof Combobox>,
  React.ComponentPropsWithoutRef<typeof Combobox>
>((props, ref) => {
  const { selected, selectedTags } = useSelectTagsContext();

  const firstTag = selectedTags?.[0];
  const firstTagId = selected?.[0];
  const tagCount = selectedTags?.length || selected?.length || 0;

  const tagsExceptFirst = selectedTags?.slice(1);
  const tagIdsExceptFirst = selected?.slice(1);

  return (
    <Combobox {...props} ref={ref}>
      {firstTag || firstTagId ? (
        <TagBadge
          tag={firstTag}
          tagId={firstTagId}
          variant="ghost"
          className="flex-auto px-0 h-auto overflow-hidden"
        />
      ) : (
        'Select Tags'
      )}
      {tagCount > 1 && (
        <Tooltip.Provider delayDuration={300}>
          <Tooltip>
            <Tooltip.Trigger asChild>
              <span className="text-muted-foreground">+{tagCount - 1}</span>
            </Tooltip.Trigger>
            <Tooltip.Content className="bg-background text-foreground shadow-xl">
              <div className="flex flex-col gap-0.5">
                {tagIdsExceptFirst?.map((tagId) => (
                  <TagBadge key={tagId} tagId={tagId} variant="ghost" />
                ))}
                {tagsExceptFirst?.map((tag) => (
                  <TagBadge key={tag._id} tag={tag} variant="ghost" />
                ))}
              </div>
            </Tooltip.Content>
          </Tooltip>
        </Tooltip.Provider>
      )}
    </Combobox>
  );
});

SingleTagWithTooltip.displayName = 'SingleTagWithTooltip';
