import { ButtonProps, cn, Combobox, Popover } from 'erxes-ui';
import React, { useState } from 'react';
import { TagBadge } from './TagBadge';
import { PureTags, TagsItem } from './PureTags';
import { ITag } from '../types/Tag';

export const SelectSingleTag = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  ButtonProps & {
    value?: string;
    onValueChange?: (value: string) => void;
    tagType: string;
  }
>(({ value, onValueChange, children, tagType, className, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Combobox.Trigger
          ref={ref}
          {...props}
          className={cn('w-full', className)}
        >
          {children ? (
            children
          ) : value ? (
            <TagBadge
              tagId={value}
              variant="ghost"
              className="px-0 flex-auto overflow-hidden"
            />
          ) : (
            'Select tag'
          )}
        </Combobox.Trigger>
      </Popover.Trigger>
      <Popover.Content className="p-0">
        <SelectSingleTagContent
          tagType={tagType}
          onSelect={(tag) => {
            onValueChange?.(tag._id);
            setOpen(false);
          }}
          value={value}
        />
      </Popover.Content>
    </Popover>
  );
});

const SelectSingleTagContent = ({
  tagType,
  onSelect,
  value,
}: {
  tagType: string;
  onSelect: (tag: ITag) => void;
  value?: string;
}) => {
  return (
    <PureTags
      tagType={tagType}
      renderItem={({ hasChildren, ...tag }) => (
        <TagsItem
          tag={tag}
          onSelect={onSelect}
          selected={tag._id === value}
          key={tag._id}
          hasChildren={hasChildren}
        />
      )}
    />
  );
};
