import { ActivityCreator } from '@/activity-logs/components/ActivityItem';
import { useActivityItemContext } from '@/activity-logs/context/ActivityItemContext';
import { TagBadges } from '@/tags/components/tagBadges';

export const ActivityTagged = () => {
  const { content, contentTypeModule } = useActivityItemContext();

  const getModuleName = (module: string) => {
    return module?.endsWith('s') ? module.slice(0, -1) : module;
  };

  const tagsText = (content?.tagIds || []).length > 1 ? 'tags' : 'tag';

  return (
    <>
      <ActivityCreator /> assigned the {tagsText}{' '}
      <span className="inline-flex flex-wrap gap-1">
        <TagBadges tagIds={content?.tagIds} />
      </span>
      {contentTypeModule && <> to this {getModuleName(contentTypeModule)}</>}.
    </>
  );
};
