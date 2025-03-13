import React, { useState } from 'react';
import { useTags } from '../hooks/useTags';
import { useDebounce } from 'use-debounce';
import { Command, SelectTree, Skeleton, TextOverflowTooltip } from 'erxes-ui';
import { IconLoader } from '@tabler/icons-react';
import { useInView } from 'react-intersection-observer';
import { ITag, SelectTagFetchMoreProps } from '../types/Tag';

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
        <TagsEmpty loading={loading} />
        <TagsFetchMore
          fetchMore={handleFetchMore}
          tagsLength={tags?.length}
          totalCount={totalCount}
        />
      </Command.List>
    </Command>
  );
});

PureTags.displayName = 'PureTags';

function TagsFetchMore({
  fetchMore,
  tagsLength,
  totalCount,
}: SelectTagFetchMoreProps) {
  const { ref: bottomRef } = useInView({
    onChange: (inView) => inView && fetchMore(),
  });

  if (!tagsLength || tagsLength >= totalCount) {
    return null;
  }

  return (
    <Command.Item value="-" disabled ref={bottomRef}>
      <IconLoader className="w-4 h-4 animate-spin text-muted-foreground mr-1" />
      Loading more...
    </Command.Item>
  );
}

const TagsEmpty = ({ loading }: { loading: boolean }) => {
  if (loading)
    return (
      <Command.Empty className="py-3 px-1">
        <Command.Skeleton />
      </Command.Empty>
    );

  return (
    <Command.Empty>
      <div>
        <div className="w-full justify-center items-center">
          <p className="text-muted-foreground p-2 ">No results found.</p>
        </div>
      </div>
    </Command.Empty>
  );
};

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
      <TextOverflowTooltip
        text={tag.name}
        className="flex-auto w-auto overflow-hidden"
      />
    </SelectTree.Item>
  );
};
