import React from 'react';
import {
  Button,
  ButtonProps,
  Command,
  Popover,
  Tabs,
} from 'erxes-ui/components';
import { useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { ITag } from '@/tags/types/tagTypes';
import { SelectTagFetchMore } from './SelectTagFetchMore';
import { SelectTagTrigger } from './SelectTagTrigger';
import { SelectTagItem } from './SelectTagItem';
import { SelectTagCreateContainer } from './SelectTagCreate';
import { useTags } from '../hooks/useTags';
import { SelectTagsLoading } from './SelectTagsLoading';
import { CreateTagForm } from './CreateTagForm';
import { IconPlus } from '@tabler/icons-react';
import {
  SelectTagsProvider,
  useSelectTags,
} from '@/tags/contexts/SelectTagsContext';
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
        <Popover open={open} onOpenChange={handleOpenChange}>
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
        </Popover>
      </SelectTagsProvider>
    );
  }
);

const Tags = React.forwardRef<React.ElementRef<typeof Command.Input>>(
  (props, ref) => {
    const { tagType, openCreateTag, sub } = useSelectTags();
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
            variant="secondary"
            wrapperClassName="flex-auto"
            ref={ref}
          />
          {!sub && (
            <Button
              variant="secondary"
              className="shadow-none h-8 w-8"
              size="icon"
              onClick={openCreateTag}
            >
              <IconPlus />
            </Button>
          )}
        </div>
        <SelectTagsLoading loading={loading} />
        <Command.List>
          {tags?.map((tag: ITag) => {
            return <SelectTagItem key={tag._id} {...tag} />;
          })}
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
