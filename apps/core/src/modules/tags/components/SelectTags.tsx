import React from 'react';
import { useRef, useState } from 'react';

import { IconPlus } from '@tabler/icons-react';
import { useSetRecoilState } from 'recoil';
import { useDebounce } from 'use-debounce';

import {
  Button,
  ButtonProps,
  Command,
  Popover,
  Tabs,
} from 'erxes-ui/components';
import { SelectTree, SelectTreeItem } from 'erxes-ui/modules/select-tree/components/SelectTree';

import { CreateTagForm } from './CreateTagForm';
import { SelectTagCreateContainer } from './SelectTagCreate';
import { SelectTagFetchMore } from './SelectTagFetchMore';
import { SelectTagsEmpty } from './SelectTagsEmpty';
import { SelectTagTrigger } from './SelectTagTrigger';
import { TagBadge } from './TagBadge';
import { useTags } from '../hooks/useTags';
import { newTagNameAtom } from '../states/selectTagsStates';

import {
  SelectTagsProvider,
  useSelectTags,
} from '@/tags/contexts/SelectTagsContext';
import { ITag } from '@/tags/types/tagTypes';
import { SelectTagsProps } from '@/tags/types/tagTypes';

export const SelectTags = React.forwardRef<
  React.ElementRef<typeof Button>,
  ButtonProps & SelectTagsProps
>(
  (
    {
      tagType = '',
      single,
      sub,
      selected = single ? '' : [],
      onSelect,
      ...buttonProps
    },
    ref
  ) => {
    const [selectedTags, setSelectedTags] = useState<ITag[]>([]);

    const [activeTab, setActiveTab] = useState('tags');
    const [open, setOpen] = useState(false);
    const commandSearchRef = useRef<HTMLInputElement>(null);

    const handleSelect = (tag: ITag) => {
      if (!onSelect) return;
      if (single) {
        onSelect(tag._id);
        setSelectedTags([tag]);
        setOpen(false);
        return;
      }
      const selectedArray = selected as string[];
      if (selectedArray.includes(tag._id)) {
        const filteredTags = selectedTags.filter((t) => t._id !== tag._id);
        onSelect(filteredTags.map((t) => t._id));
        setSelectedTags(filteredTags);
        return;
      }
      onSelect([...selectedArray, tag._id]);
      setSelectedTags([...selectedTags, tag]);
    };

    const focusCommandInput = () =>
      !sub && setTimeout(() => commandSearchRef.current?.focus());

    const handleBack = () => {
      setActiveTab('tags');
      focusCommandInput();
    };

    const handleOpenChange = (open: boolean) => {
      setOpen(open);
      if (activeTab === 'tags' && open) {
        focusCommandInput();
      }
    };

    return (
      <SelectTagsProvider
        value={{
          tagType,
          selectedTagIds: single
            ? [selected as string]
            : (selected as string[]),
          selectedTags,
          setSelectedTags,
          handleSelect,
          openCreateTag: () => setActiveTab('create'),
          sub,
        }}
      >
        <SelectTree id="tags">
          <SelectTagTrigger {...buttonProps} ref={ref} />
          <Popover.Content className="p-0">
            {sub ? (
              <Tags ref={commandSearchRef} />
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <Tabs.Content value="tags" asChild>
                  <Tags ref={commandSearchRef} />
                </Tabs.Content>
                <SelectTagCreateContainer onBack={handleBack}>
                  <CreateTagForm
                    tagType={tagType}
                    onCompleted={(tag) => {
                      handleSelect(tag);
                      setActiveTab('tags');
                    }}
                  />
                </SelectTagCreateContainer>
              </Tabs>
            )}
          </Popover.Content>
        </SelectTree>
      </SelectTagsProvider>
    );
  }
);

const Tags = React.forwardRef<React.ElementRef<typeof Command.Input>>(
  (props, ref) => {
    const { tagType } = useSelectTags();
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);
    const { tags, handleFetchMore, totalCount, loading } = useTags({
      variables: {
        type: tagType,
        searchValue: debouncedSearch,
      },
      skip: !open,
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
        <SelectTagsEmpty loading={loading} />
        <Command.List>
          {tags?.map((tag: ITag) => {
            return (
              <SelectTagItem
                key={tag._id}
                {...tag}
                hasChildren={!!tags?.find((t) => t.parentId === tag._id)}
              />
            );
          })}
          {tags?.length === 0 && <SelectTagSearchCreate search={search} />}
          <SelectTagFetchMore
            fetchMore={handleFetchMore}
            tagsLength={tags?.length}
            totalCount={totalCount}
          />
        </Command.List>
      </Command>
    );
  }
);

export function SelectTagItem(props: ITag & { hasChildren: boolean }) {
  const { _id, order, hasChildren, name } = props || {};
  const { selectedTags, handleSelect } = useSelectTags();
  
  const isSelected = selectedTags?.some((tag: ITag) => tag._id === _id);

  return (
    <SelectTreeItem 
      order={order}
      hasChildren={hasChildren}
      name={name}
      value={name}
      onSelect={() => handleSelect(props)}
      selected={isSelected}
    >
      <TagBadge {...props} />
    </SelectTreeItem>
  );
}

export const SelectTagSearchCreate = ({ search }: { search: string }) => {
  const { openCreateTag } = useSelectTags();
  const setName = useSetRecoilState(newTagNameAtom);

  return (
    <Command.Item onSelect={() => {
      setName(search);
      openCreateTag();
    }} className='justify-start'>
      <IconPlus />
      Create new tag: "{search}"
    </Command.Item>
  );
}
