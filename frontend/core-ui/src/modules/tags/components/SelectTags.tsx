import React, { useEffect, useRef, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { useDebounce } from 'use-debounce';

import { Button, ButtonProps, Command, Tabs } from 'erxes-ui/components';
import {
  SelectTree,
  SelectTreeItem,
} from 'erxes-ui/modules/select-tree/components/SelectTree';
import { InlineCell } from 'erxes-ui/modules/inline-cell/components/InlineCell';
import { InlineCellDisplay } from 'erxes-ui/modules/inline-cell/components/InlineCellDisplay';
import { InlineCellEdit } from 'erxes-ui/modules/inline-cell/components/InlineCellEdit';

import { CreateTagForm } from './CreateTagForm';
import { SelectTagCreateContainer } from './SelectTagCreate';
import { SelectTagFetchMore } from './SelectTagFetchMore';
import { SelectTagsEmpty } from './SelectTagsEmpty';
import { TagBadge } from './TagBadge';
import { useTags } from '../hooks/useTags';
import { newTagNameAtom } from '../states/selectTagsStates';
import {
  SelectTagsProvider,
  useSelectTags,
} from '@/tags/contexts/SelectTagsContext';
import { ITag } from '@/tags/types/tagTypes';
import { SelectTagsProps } from '@/tags/types/tagTypes';
import { useSetAtom } from 'jotai';

export const SelectTags = React.forwardRef<
  React.ElementRef<typeof Button>,
  Omit<ButtonProps, 'onSelect'> & SelectTagsProps
>(
  (
    { tagType, single, sub, selected = [], onSelect, recordId, ...buttonProps },
    ref,
  ) => {
    const { tags, loading } = useTags({
      variables: {
        type: tagType,
      },
    });
    const [selectedTags, setSelectedTags] = useState<ITag[]>([]);

    // Sync selected tag IDs with tag objects when tags load or selected IDs change
    useEffect(() => {
      if (!loading && tags && tags.length > 0) {
        const tagMap = new Map(tags.map(tag => [tag._id, tag]));
        const validSelectedTags = Array.isArray(selected) 
          ? selected.map(id => tagMap.get(id)).filter(Boolean) as ITag[]
          : selected && typeof selected === 'string' && tagMap.has(selected) 
            ? [tagMap.get(selected) as ITag] 
            : [];
            
        setSelectedTags(validSelectedTags);
      }
    }, [loading, selected, tags]);

    const [activeTab, setActiveTab] = useState('tags');
    const commandSearchRef = useRef<HTMLInputElement>(null);

    // Simplified and fixed handleSelect function
    const handleSelect = (tag: ITag) => {
      if (!onSelect) return;

      if (single) {
        // For single selection, always replace with the new tag
        onSelect([tag._id]);
        setSelectedTags([tag]);
      } else {
        // For multiple selection, toggle the tag
        const selectedIds = selectedTags.map(t => t._id);
        const tagIndex = selectedIds.indexOf(tag._id);
        
        if (tagIndex >= 0) {
          // Tag exists - remove it
          const newSelectedTags = [...selectedTags];
          newSelectedTags.splice(tagIndex, 1);
          setSelectedTags(newSelectedTags);
          onSelect(newSelectedTags.map(t => t._id));
        } else {
          // Tag doesn't exist - add it
          const newSelectedTags = [...selectedTags, tag];
          setSelectedTags(newSelectedTags);
          onSelect(newSelectedTags.map(t => t._id));
        }
      }
    };

    const focusCommandInput = () =>
      !sub && setTimeout(() => commandSearchRef.current?.focus());

    const handleBack = () => {
      setActiveTab('tags');
      focusCommandInput();
    };

    const handleEscape = (closeEditMode: () => void) => {
      closeEditMode();
      setActiveTab('tags');
    };

    return (
      <SelectTagsProvider
        value={{
          tagType,
          selectedTagIds: single
            ? (typeof selected === 'string' ? [selected] : selected && selected.length > 0 ? [selected[0]] : [])
            : (Array.isArray(selected) ? selected : []),
          selectedTags,
          setSelectedTags,
          handleSelect,
          openCreateTag: () => setActiveTab('create'),
          sub,
        }}
      >
        <InlineCell
          name="tags"
          recordId={recordId}
          onEscape={handleEscape}
          display={() => (
            <TagsDisplay
              selectedTags={selectedTags}
              ref={ref}
              {...buttonProps}
            />
          )}
          edit={(closeEditMode: () => void) => {
            return (
              <InlineCellEdit>
                <SelectTree id="tags">
                  {sub ? (
                    <Tags
                      ref={commandSearchRef}
                      single={single}
                      closeEditMode={closeEditMode}
                    />
                  ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <Tabs.Content value="tags" asChild>
                        <Tags
                          ref={commandSearchRef}
                          closeEditMode={closeEditMode}
                        />
                      </Tabs.Content>
                      {!single && (
                        <SelectTagCreateContainer onBack={handleBack}>
                          <CreateTagForm
                            tagType={tagType}
                            onCompleted={(tag) => {
                              handleSelect(tag);
                              setActiveTab('tags');
                            }}
                          />
                        </SelectTagCreateContainer>
                      )}
                    </Tabs>
                  )}
                </SelectTree>
              </InlineCellEdit>
            );
          }}
        />
      </SelectTagsProvider>
    );
  },
);

const TagsDisplay = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & { selectedTags: ITag[] }
>(({ selectedTags, ...props }, ref) => (
  <InlineCellDisplay className="w-full h-cell" ref={ref} asChild {...props}>
    <div className="w-full relative h-cell group">
      {selectedTags.map((tag) => (
        <TagBadge key={tag._id} {...tag} />
      ))}
      <Button
        variant="outline"
        size="icon"
        className="absolute right-1 size-5 px-0 hidden items-center hover:bg-border justify-center group-hover:flex"
      >
        <IconPlus className="text-muted-foreground" />
      </Button>
    </div>
  </InlineCellDisplay>
));

const Tags = React.forwardRef<
  React.ElementRef<typeof Command.Input>,
  { single?: boolean; closeEditMode: () => void }
>(({ single = false, closeEditMode }, ref) => {
  const { tagType } = useSelectTags();
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
        />
      </div>
      <SelectTagsEmpty loading={loading} single={single} />
      <Command.List>
        {tags?.map((tag: ITag) => (
          <SelectTagItem
            key={tag._id}
            {...tag}
            hasChildren={!!tags?.find((t: ITag) => t.parentId === tag._id)}
            closeEditMode={single ? closeEditMode : undefined}
          />
        ))}
        {tags?.length === 0 && !single && (
          <SelectTagSearchCreate search={search} />
        )}
        <SelectTagFetchMore
          fetchMore={handleFetchMore}
          tagsLength={tags?.length}
          totalCount={totalCount}
        />
      </Command.List>
    </Command>
  );
});

export function SelectTagItem(
  props: ITag & { hasChildren: boolean; closeEditMode?: () => void },
) {
  const { _id, order, hasChildren, name, closeEditMode } = props || {};
  const { selectedTags, handleSelect } = useSelectTags();

  const isSelected = selectedTags?.some((tag: ITag) => tag._id === _id);

  return (
    <SelectTreeItem
      order={order}
      hasChildren={hasChildren}
      name={name}
      value={name}
      onSelect={() => {
        handleSelect(props);
        if (closeEditMode) {
          closeEditMode();
        }
      }}
      selected={isSelected}
    >
      {props.name}
    </SelectTreeItem>
  );
}

export const SelectTagSearchCreate = ({ search }: { search: string }) => {
  const { openCreateTag } = useSelectTags();
  const setName = useSetAtom(newTagNameAtom);

  return (
    <Command.Item
      onSelect={() => {
        setName(search);
        openCreateTag();
      }}
      className="justify-start h-cell"
    >
      <IconPlus />
      Create new tag: "{search}"
    </Command.Item>
  );
};