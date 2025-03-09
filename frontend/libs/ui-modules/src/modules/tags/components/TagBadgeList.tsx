import React from 'react';
import { Button } from 'erxes-ui';
import { IconX } from '@tabler/icons-react';
import { TagBadge } from './TagBadge';
import { useSelectTagsContext } from '../hooks/useSelectTagsContext';
import { ITag } from '../types/Tag';

interface TagBadgeListProps {
  withClose?: boolean;
}

const RemoveTagButton = ({ tag }: { tag: ITag }) => {
  const { onSelect } = useSelectTagsContext();

  const handleClick = React.useCallback(() => {
    onSelect?.(tag);
  }, [onSelect, tag]);

  return (
    <Button
      size="icon"
      variant="ghost"
      className="ml-1 h-full w-7 hover:bg-border"
      onClick={handleClick}
      tabIndex={-1}
    >
      <IconX />
    </Button>
  );
};

RemoveTagButton.displayName = 'RemoveTagButton';

export const TagBadgeList = ({ withClose }: TagBadgeListProps) => {
  const { selected, selectedTags } = useSelectTagsContext();

  const renderClose = withClose
    ? (tagValue: ITag) => <RemoveTagButton tag={tagValue} />
    : undefined;

  if (selectedTags?.length) {
    return selectedTags.map((tag) => (
      <TagBadge key={tag._id} tag={tag} renderClose={renderClose} />
    ));
  }

  return selected?.map((tagId) => (
    <TagBadge key={tagId} tagId={tagId} renderClose={renderClose} />
  ));
};

TagBadgeList.displayName = 'TagBadgeList';
