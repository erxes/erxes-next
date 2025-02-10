import { useTagsByIds } from '@/tags/hooks/useTags';
import { TagBadge } from './TagBadge';
import { TagBadgesProps, ITag } from '@/tags/types/tagTypes';
import { Skeleton } from 'erxes-ui/components';

export const TagBadges = ({ tagIds, tags }: TagBadgesProps) => {
  if (!tagIds?.length && !tags?.length) {
    return <span className="text-muted-foreground/50">Empty</span>;
  }

  if (tags) {
    return tags.map((tag: ITag) => <TagBadge key={tag._id} {...tag} />);
  }

  return tagIds?.map((tagId: string) => (
    <TagBadgeById key={tagId} tagId={tagId} />
  ));
};

const TagBadgeById = ({ tagId }: { tagId: string }) => {
  const { tags: fetchedTags, loading } = useTagsByIds({
    variables: {
      tagIds: [tagId],
    },
  });

  if (loading) {
    return <Skeleton className="w-8 h-4" />;
  }

  return <TagBadge {...fetchedTags[0]} />;
};
