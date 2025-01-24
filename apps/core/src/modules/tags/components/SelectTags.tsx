import { useTags } from '@/tags/hooks/useTags';
import {
  IconCheck,
  IconChevronLeft,
  IconCirclePlus,
  IconLoader,
} from '@tabler/icons-react';
import { Badge, Button, Command, Popover, Tabs } from 'erxes-ui/components';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { CreateTagForm } from './CreateTagForm';
import { cn } from 'erxes-ui/lib';
import { useInView } from 'react-intersection-observer';
import { ITag } from '@/tags/types/tagTypes';
import { Color } from 'erxes-ui/components/colors';

interface SelectTagsProps {
  type?: string;
  sub?: boolean;
  single?: boolean;
  selected?: string[] | string;
  onSelect?: (tags: string[] | string) => void;
  className?: string;
}

export function SelectTags({
  type,
  sub,
  single,
  selected,
  onSelect,
  className,
}: SelectTagsProps) {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [activeTab, setActiveTab] = useState('tags');

  const { tags, loading, getTagByTagId, handleFetchMore, totalCount } = useTags(
    {
      variables: {
        type,
        searchValue: debouncedSearch,
      },
    }
  );

  const { ref: bottomRef } = useInView({
    onChange: (inView) => inView && handleFetchMore(),
  });

  const handleCreateTag = () => setActiveTab('create');

  return (
    <Popover>
      <SelectTagTrigger
        selected={selected}
        getTagByTagId={getTagByTagId}
        single={single}
        className={className}
      />
      <Popover.Content className="p-0">
        <Tabs
          defaultValue="tags"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <Tabs.Content value="tags" asChild>
            <Command className="outline-none" shouldFilter={false}>
              <div className="flex items-center pr-1">
                <Command.Input
                  placeholder="Search tags"
                  wrapperClassName="flex-auto"
                  variant="secondary"
                  value={search}
                  onValueChange={(value) => setSearch(value)}
                />
                {!sub && (
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleCreateTag}
                    className="h-8 w-8 shadow-none"
                  >
                    <IconCirclePlus className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <Command.List className="h-[300px] overflow-auto">
                <Command.Empty>
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <IconLoader className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      No results found.
                      <Button variant="secondary" onClick={handleCreateTag}>
                        Create new tag
                      </Button>
                    </>
                  )}
                </Command.Empty>

                {tags?.map((tag) => (
                  <SelectTagItem
                    key={tag._id}
                    tag={tag}
                    getTagByTagId={getTagByTagId}
                    single={single}
                    selected={selected}
                    onSelect={onSelect}
                  />
                ))}
                {tags?.length < totalCount && (
                  <Command.Item value="-" disabled ref={bottomRef}>
                    <IconLoader className="w-4 h-4 animate-spin text-muted-foreground" />{' '}
                    Loading more...
                  </Command.Item>
                )}
              </Command.List>
            </Command>
          </Tabs.Content>
          <Tabs.Content value="create" asChild>
            <div className="h-[340px] p-2 overflow-auto">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab('tags')}
                  size="icon"
                >
                  <IconChevronLeft className="w-4 h-4" />
                </Button>
                <h6 className="text-sm font-medium">Create new tag</h6>
              </div>
              <CreateTagForm type={type} />
            </div>
          </Tabs.Content>
        </Tabs>
      </Popover.Content>
    </Popover>
  );
}

interface SelectTagTriggerProps {
  selected?: string[] | string;
  getTagByTagId: (tagId: string) => ITag;
  single?: boolean;
  className?: string;
}

function SelectTagTrigger({
  selected,
  getTagByTagId,
  single,
  className,
}: SelectTagTriggerProps) {
  const buttonClasses = cn(
    'justify-start border-dashed shadow-none ring-0 border overflow-auto gap-1 px-1 min-w-60',
    className
  );

  return (
    <Popover.Trigger asChild>
      <Button variant="outline" className={buttonClasses}>
        {selected &&
          (single ? (
            <TagBadge {...getTagByTagId(selected as string)} />
          ) : (
            (selected as string[])?.map((tagId) => (
              <TagBadge key={tagId} {...getTagByTagId(tagId)} />
            ))
          ))}
      </Button>
    </Popover.Trigger>
  );
}

function TagBadge({ colorCode, _id, name }: ITag) {
  return (
    <Badge color={colorCode as Color} colorSeed={_id} className="gap-2">
      {name}
    </Badge>
  );
}

interface SelectTagItemProps {
  tag: ITag;
  getTagByTagId: (tagId: string) => ITag;
  single?: boolean;
  selected?: string[] | string;
  onSelect?: (tags: string[] | string) => void;
}

function SelectTagItem({
  tag,
  single,
  selected,
  onSelect,
}: SelectTagItemProps) {
  const isSelected = single
    ? selected === tag._id
    : (selected as string[])?.includes(tag._id);

  const indentationLevel = (tag?.order?.match(/[/]/gi)?.length || 0) - 1;

  const handleSelect = () => {
    if (!onSelect) return;

    const newSelection = single
      ? tag._id
      : (selected as string[])?.includes(tag._id)
      ? (selected as string[]).filter((t) => t !== tag._id)
      : [...((selected as string[]) || []), tag._id];

    onSelect(newSelection);
  };

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
        value={tag._id}
        onSelect={handleSelect}
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
        <TagBadge {...tag} />
      </Command.Item>
    </div>
  );
}
