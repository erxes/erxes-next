import React, { useState } from 'react';
import { useTags } from '../hooks/useTags';
import { useDebounce } from 'use-debounce';
import { Combobox, Command, SelectTree, TextOverflowTooltip } from 'erxes-ui';
import { ITag } from '../types/Tag';

export const PureTags = React.forwardRef<
  React.ElementRef<typeof Command.Input>,
  React.ComponentPropsWithoutRef<typeof Command.Input> & {
    tagType: string;
    renderItem: (tag: ITag & { hasChildren: boolean }) => React.ReactNode;
    renderContent?: (tags: ITag[], search: string) => React.ReactNode;
  }
>(({ tagType, renderItem, children, renderContent, ...props }, ref) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const { tags, handleFetchMore, totalCount, loading } = useTags({
    variables: {
      type: tagType,
      searchValue: debouncedSearch,
    },
  });

  return (
    <Command className="outline-none" shouldFilter={false}>
      <div className="flex items-center pr-1">
        <Command.Input
          value={search}
          onValueChange={setSearch}
          wrapperClassName="flex-auto"
          ref={ref}
          {...props}
        />
      </div>
      {children}
      <Command.List className="p-1 [&>*]:space-y-0.5">
        <SelectTree.Provider
          id="tags"
          length={tags?.length}
          ordered={!debouncedSearch}
        >
          {tags?.map((tag: ITag) =>
            renderItem({
              ...tag,
              hasChildren: !!tags?.find((t: ITag) => t.parentId === tag._id),
            }),
          )}
          {renderContent?.(tags, search)}
        </SelectTree.Provider>
        <Combobox.Empty loading={loading} />
        <Combobox.FetchMore
          fetchMore={handleFetchMore}
          currentLength={tags?.length}
          totalCount={totalCount}
        />
      </Command.List>
    </Command>
  );
});

PureTags.displayName = 'PureTags';

export const TagsItem = ({
  tag,
  onSelect,
  selected,
  hasChildren,
}: {
  tag: ITag;
  onSelect: (tag: ITag) => void;
  selected: boolean;
  hasChildren: boolean;
}) => {
  return (
    <SelectTree.Item
      value={tag._id}
      onSelect={() => onSelect(tag)}
      name={tag.name}
      order={tag.order}
      selected={selected}
      hasChildren={hasChildren}
    >
      <TextOverflowTooltip value={tag.name} className="flex-auto w-auto " />
    </SelectTree.Item>
  );
};
