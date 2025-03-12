import React from 'react';
import { Command, Separator, Spinner } from 'erxes-ui';
import { IconPlus } from '@tabler/icons-react';
import { useSelectTagsContext } from '../hooks/useSelectTagsContext';
import { ITag } from '../types/Tag';
import { useSetAtom } from 'jotai';
import { newTagNameState } from '../states/newTagNameState';
import { TagBadgeList } from './TagBadgeList';
import { PureTags, TagsItem } from './PureTags';

export const TagsInSelectTags = React.forwardRef<
  React.ElementRef<typeof Command.Input>,
  React.ComponentPropsWithoutRef<typeof Command.Input>
>((props, ref) => {
  const { tagType, selected, selectedTags, loading } = useSelectTagsContext();

  return (
    <PureTags
      tagType={tagType}
      {...props}
      ref={ref}
      renderItem={(tag) => <SelectTagsItem key={tag._id} {...tag} />}
      renderContent={(tags, search) =>
        tags?.length === 0 && <SelectTagsSearchCreateTrigger search={search} />
      }
    >
      {(selectedTags || selected)?.length > 0 && (
        <>
          <div className="flex gap-1 flex-wrap p-2">
            <TagBadgeList withClose />
          </div>
          <Separator />
        </>
      )}
      {loading && (
        <div className="absolute inset-0 bg-foreground/10 grid place-items-center z-50">
          <Spinner className="text-foreground" />
        </div>
      )}
    </PureTags>
  );
});

function SelectTagsItem({
  hasChildren,
  closeEditMode,
  ...tag
}: ITag & { hasChildren: boolean; closeEditMode?: () => void }) {
  const { selected, onSelect } = useSelectTagsContext();

  const isSelected = selected?.some((tagId: string) => tagId === tag._id);

  return (
    <TagsItem
      tag={tag}
      hasChildren={hasChildren}
      selected={isSelected}
      onSelect={() => {
        onSelect(tag);
        if (closeEditMode) {
          closeEditMode();
        }
      }}
    />
  );
}

const SelectTagsSearchCreateTrigger = ({ search }: { search: string }) => {
  const { setActiveTab } = useSelectTagsContext();
  const setName = useSetAtom(newTagNameState);

  return (
    <Command.Item
      onSelect={() => {
        setName(search);
        setActiveTab('create');
      }}
      className="justify-start h-cell"
    >
      <IconPlus />
      Create new tag: "{search}"
    </Command.Item>
  );
};
