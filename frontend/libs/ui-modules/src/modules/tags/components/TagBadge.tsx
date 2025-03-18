import { Badge, cn, Skeleton, TextOverflowTooltip } from 'erxes-ui';
import { useTagsByIds } from '../hooks/useTags';
import { ITag } from '../types/Tag';
import React from 'react';

export const TagBadge = React.forwardRef<
  React.ElementRef<typeof Badge>,
  React.ComponentPropsWithoutRef<typeof Badge> & {
    tag?: ITag;
    tagId?: string;
    renderClose?: (tag: ITag) => React.ReactNode;
  }
>(({ tag, tagId, renderClose, ...props }, ref) => {
  const { tags = [], loading } = useTagsByIds({
    variables: {
      tagIds: [tagId],
    },
    skip: !!tag || !tagId,
  });

  const tagValue = tag || tags[0];

  if (loading) {
    return <Skeleton className="w-8 h-4" />;
  }

  if (!tagValue) {
    return null;
  }

  return (
    <Badge
      variant="muted"
      className={cn(renderClose && 'pr-0 py-0')}
      ref={ref}
      {...props}
    >
      <TextOverflowTooltip value={tagValue?.name} />
      {renderClose && renderClose(tagValue)}
    </Badge>
  );
});
