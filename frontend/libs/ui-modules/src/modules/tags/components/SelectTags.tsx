import { Combobox, Command, SelectTree, TextOverflowTooltip } from 'erxes-ui';
import { useTags } from '../hooks/useTags';
import { useDebounce } from 'use-debounce';
import React, { useState } from 'react';
import {
  ISelectTagsProviderProps,
  ITag,
  useGiveTags,
} from 'ui-modules/modules';
import { SelectTagsContext } from '../contexts/SelectTagsContext';
import { useSelectTagsContext } from '../hooks/useSelectTagsContext';
import { IconPlus } from '@tabler/icons-react';
import { CreateTagForm } from './CreateTagForm';
import { TagBadge } from './TagBadge';

export const SelectTagsProvider = ({
  children,
  tagType,
  value,
  onValueChange,
  targetIds,
  options,
  mode = 'single',
}: ISelectTagsProviderProps) => {
  const [newTagName, setNewTagName] = useState('');
  const { giveTags } = useGiveTags();
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);

  const handleSelectCallback = (tag: ITag) => {
    if (!tag) {
      return;
    }

    let newSelectedTagIds: string[] = [];

    if (mode === 'single') {
      setSelectedTags([tag]);
      onValueChange?.(tag._id);
      newSelectedTagIds = [tag._id];
    } else {
      const multipleValue = (value as string[]) || [];
      const isSelected = multipleValue.includes(tag._id);

      newSelectedTagIds = isSelected
        ? multipleValue.filter((t) => t !== tag._id)
        : [...multipleValue, tag._id];

      const newSelectedTags = isSelected
        ? selectedTags.filter((t) => t._id !== tag._id)
        : [...selectedTags, tag];

      onValueChange?.(newSelectedTagIds);
      setSelectedTags(newSelectedTags);
    }

    if (targetIds) {
      giveTags({
        variables: {
          tagIds: newSelectedTagIds,
          targetIds,
          type: tagType,
        },
        ...options?.(newSelectedTagIds),
      });
    }
  };

  return (
    <SelectTagsContext.Provider
      value={{
        tagType,
        onSelect: handleSelectCallback,
        value,
        selectedTags,
        setSelectedTags,
        targetIds: targetIds || [],
        newTagName,
        setNewTagName,
        mode,
      }}
    >
      {children}
    </SelectTagsContext.Provider>
  );
};

export const SelectTagsCommand = ({
  disableCreateOption,
}: {
  disableCreateOption?: boolean;
}) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const { tagType, targetIds } = useSelectTagsContext();
  const [noTagsSearchValue, setNoTagsSearchValue] = useState('');

  const { tags, loading, error, handleFetchMore, totalCount } = useTags({
    variables: {
      type: tagType,
      searchValue: debouncedSearch,
    },
    skip: !!noTagsSearchValue && debouncedSearch.includes(noTagsSearchValue),
    onCompleted(data: { tags: { totalCount: number; list: ITag[] } }) {
      const { totalCount } = data?.tags || {};
      setNoTagsSearchValue(totalCount === 0 ? debouncedSearch : '');
    },
  });

  return (
    <Command shouldFilter={false}>
      <Command.Input
        value={search}
        onValueChange={setSearch}
        placeholder="Search tags"
      />
      <Command.List>
        <SelectTree.Provider id={targetIds.join(',')} ordered={!search}>
          <SelectTagsCreate
            search={search}
            show={
              !disableCreateOption ||
              (search.length > 0 && !loading && tags?.length === 0)
            }
          />
          <Combobox.Empty loading={loading} error={error} />
          {tags?.map((tag) => (
            <SelectTagsItem
              key={tag._id}
              tag={{
                ...tag,
                hasChildren: tags.some((t) => t.parentId === tag._id),
              }}
            />
          ))}
          <Combobox.FetchMore
            fetchMore={handleFetchMore}
            currentLength={tags?.length || 0}
            totalCount={totalCount}
          />
        </SelectTree.Provider>
      </Command.List>
    </Command>
  );
};

export const SelectTagsCreate = ({
  search,
  show,
}: {
  search: string;
  show: boolean;
}) => {
  const { setNewTagName } = useSelectTagsContext();
  if (!search || !show) return null;

  return (
    <Command.Item
      onSelect={() => setNewTagName(search)}
      className="font-medium"
    >
      <IconPlus />
      Create new tag: "{search}"
    </Command.Item>
  );
};

export const SelectTagsItem = ({
  tag,
}: {
  tag: ITag & { hasChildren: boolean };
}) => {
  const { value, onSelect } = useSelectTagsContext();
  const isSelected = Array.isArray(value)
    ? (value as string[]).includes(tag._id)
    : value === tag._id;

  return (
    <SelectTree.Item
      key={tag._id}
      id={tag._id}
      name={tag.name}
      order={tag.order}
      hasChildren={tag.hasChildren}
      selected={isSelected}
      onSelect={() => onSelect(tag)}
    >
      <TextOverflowTooltip
        value={tag.name}
        className="flex-auto w-auto font-medium text-base"
      />
    </SelectTree.Item>
  );
};

export const TagList = ({
  placeholder,
  onClose,
  ...props
}: Omit<React.ComponentProps<typeof TagBadge>, 'onClose'> & {
  placeholder?: string;
  onClose?: (tagId?: string) => void;
}) => {
  const { value, selectedTags, mode } = useSelectTagsContext();

  const selectedTagIds = Array.isArray(value) ? value : [value];

  if (!value || !value.length) {
    return <Combobox.Value placeholder={placeholder || ''} />;
  }

  return (
    <>
      {selectedTagIds.map((tagId) => (
        <TagBadge
          key={tagId}
          tagId={tagId}
          tag={selectedTags.find((t) => t._id === tagId)}
          renderAsPlainText={mode === 'single'}
          variant="secondary"
          onClose={() => onClose?.(tagId)}
          {...props}
        />
      ))}
    </>
  );
};

export const SelectTagsContent = () => {
  const { newTagName } = useSelectTagsContext();

  if (newTagName) {
    return <CreateTagForm />;
  }

  return <SelectTagsCommand />;
};

export const SelectTags = Object.assign(SelectTagsProvider, {
  Content: SelectTagsContent,
  Command: SelectTagsCommand,
  Item: SelectTagsItem,
  Value: TagList,
});
