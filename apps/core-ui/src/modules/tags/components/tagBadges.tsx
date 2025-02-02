import { useTagsByIds } from '@/tags/hooks/useTags';
import { TagBadge } from './TagBadge';
import { TagBadgesProps } from '@/tags/types/tagTypes';
import { Skeleton } from 'erxes-ui/components';

export const TagBadges = ({ tagIds, tags }: TagBadgesProps) => {
  const { tags: fetchedTags, loading } = useTagsByIds({
    variables: {
      tagIds,
    },
    skip: !(tagIds || tags)?.length,
  });

  const displayTags = tags || fetchedTags;

  if (loading) {
    return (
      <>
        {[...Array(Math.min(2, tagIds?.length || 0))].map((_, index) => (
          <Skeleton key={index} className="w-8 h-4" />
        ))}
      </>
    );
  }

  if (!displayTags?.length) {
    return <span className="text-muted-foreground/50">Empty</span>;
  }

  return displayTags.map((tag) => <TagBadge key={tag._id} {...tag} />);
};
