import { IconTagsFilled } from '@tabler/icons-react';
import { Button, Skeleton, useMultiQueryState } from 'erxes-ui';
import { useTags } from 'ui-modules';

export const TagsSettingBreadcrumb = () => {
  const [queries] = useMultiQueryState<{
    contentType: string;
    searchValue: string;
  }>(['contentType', 'searchValue']);
  const { contentType, searchValue } = queries;

  const { totalCount, loading } = useTags({
    variables: {
      type: contentType || '',
      searchValue: searchValue ?? undefined,
    },
  });
  return (
    <>
      <Button variant="ghost" className="font-semibold">
        <IconTagsFilled className="size-4 text-accent-foreground" />
        Tags
        <span className="text-sm text-muted-foreground">
          {loading ? (
            <Skeleton className="size-4" />
          ) : (
            `(${totalCount || 'No results found'})`
          )}
        </span>
      </Button>
    </>
  );
};
