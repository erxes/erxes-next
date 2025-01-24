import { Command } from 'erxes-ui/components';
import { IconCheck } from '@tabler/icons-react';
import { cn } from 'erxes-ui/lib';
import { ITag } from '@/tags/types/tagTypes';
import { TagBadge } from './TagBadge';
import { useSelectTags } from '@/tags/contexts/SelectTagsContext';

export function SelectTagItem(props: ITag) {
  const { _id, order } = props || {};
  const { selectedTags, handleSelect } = useSelectTags();

  const isSelected = !!(selectedTags as ITag[])?.find((t) => t._id === _id);

  const indentationLevel = (order?.match(/[/]/gi)?.length || 0) - 1;

  return (
    <div className="flex items-center">
      {indentationLevel > 0 && (
        <div className="flex h-full gap-[22px] pl-[13px] pr-2">
          {Array.from({ length: indentationLevel }).map((_, index) => (
            <div key={index} className="relative">
              <div className="absolute -top-4 h-8 w-px bg-muted-foreground/20" />
            </div>
          ))}
        </div>
      )}
      <Command.Item
        value={_id}
        onSelect={() => handleSelect(props)}
        className="flex-auto"
      >
        <div
          className={cn(
            'flex size-3 items-center justify-center rounded-sm border border-primary',
            isSelected
              ? 'bg-primary text-primary-foreground'
              : 'opacity-50 [&_svg]:invisible'
          )}
        >
          <IconCheck className={cn('!size-3')} />
        </div>
        <TagBadge {...props} />
      </Command.Item>
    </div>
  );
}
