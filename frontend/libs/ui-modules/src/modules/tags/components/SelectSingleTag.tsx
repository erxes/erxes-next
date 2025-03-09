import { ButtonProps, Combobox, Popover } from 'erxes-ui';
import React, { useState } from 'react';
import { TagBadge } from './TagBadge';
import { PureTags, TagsItem } from './PureTags';
import { ITag } from '../types/Tag';

export const SelectSingleTag = React.forwardRef<
  React.ElementRef<typeof Combobox>,
  ButtonProps & {
    value?: string;
    onValueChange?: (value: string) => void;
    tagType: string;
  }
>(({ value, onValueChange, children, tagType, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Combobox ref={ref} {...props} className="w-full">
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
        </Combobox>
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
      renderItem={(tag) => (
        <TagsItem tag={tag} onSelect={onSelect} selected={tag._id === value} />
      )}
    />
  );
};
