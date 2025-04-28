import { toast } from 'erxes-ui';
import { ApolloError } from '@apollo/client';
import { SelectTags, useGiveTags, SelectTagsProps } from 'ui-modules';

interface TagsField extends SelectTagsProps {
  _id: string;
}

export const TagsField = ({ _id, tagType, selected, recordId }: TagsField) => {
  const { giveTags, loading } = useGiveTags();
  return (
    <SelectTags
      tagType={tagType}
      selected={selected as string[]}
      recordId={recordId}
      loading={loading}
      onSelect={(tagIds: string[] | string) => {
        giveTags({
          variables: { type: 'core:customer', targetIds: [_id], tagIds },
          update: (cache) => {
            cache.modify({
              id: cache.identify({
                __typename: 'Customer',
                _id,
              }),
              fields: { tagIds: () => tagIds },
            });
          },
          onError: (e: ApolloError) => {
            toast({
              title: 'Error',
              description: e.message,
            });
          },
        });
      }}
    />
  );
};
