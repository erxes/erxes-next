import { SelectTags } from '@/tags/components/SelectTags';
import { useCompaniesEdit } from '@/contacts/companies/hooks/useCompaniesEdit';
import { SelectTagsProps } from '@/tags/types/tagTypes';
import { toast } from 'erxes-ui/hooks';
import { ApolloError } from '@apollo/client';

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
  const { companiesEdit } = useCompaniesEdit();
  return (
    <SelectTags
      tagType={tagType}
      single={single}
      sub={sub}
      selected={selected}
      recordId={recordId}
      onSelect={(tagIds: string[] | string) => {
        companiesEdit(
          {
            variables: { _id, tagIds },
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
