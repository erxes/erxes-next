import { SelectTags } from '@/tags/components/SelectTags';
import { useCustomersTag } from '~/modules/contacts/customer-edit/hooks/useCustomersTag';
import { toast } from 'erxes-ui/hooks';
import { ApolloError } from '@apollo/client';
import { SelectTagsProps } from '@/tags/types/tagTypes';

interface TagsField extends SelectTagsProps {
  _id: string;
}

export const TagsField = ({
  _id,
  tagType,
  single,
  sub,
  selected,
  recordId,
}: TagsField) => {
  const { customersTag } = useCustomersTag();
  return (
    <SelectTags
      tagType={tagType}
      single={single}
      sub={sub}
      selected={selected}
      recordId={recordId}
      onSelect={(tagIds: string[] | string) => {
        customersTag(
          {
            variables: { targetIds: [_id], tagIds },
            onError: (e: ApolloError) => {
              toast({
                title: 'Error',
                description: e.message,
              });
            },
          },
          ['tagIds'],
        );
      }}
    />
  );
};
