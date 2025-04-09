import { SelectTags } from 'ui-modules';
// import { useCompaniesEdit } from '@/contacts/companies/hooks/useCompaniesEdit';
import { toast } from 'erxes-ui';
import { ApolloError } from '@apollo/client';
import { SelectTagsProps } from 'frontend/libs/ui-modules/src/modules/tags/types/Tag';

interface TagsField extends SelectTagsProps {
  _id: string;
}

export const TagsField = ({ _id, tagType, selected, recordId }: TagsField) => {
  //   const { companiesEdit } = useCompaniesEdit();
  return (
    <SelectTags
      tagType={tagType}
      selected={selected}
      recordId={recordId}
      //   onSelect={(tagIds: string[] | string) => {
      //     companiesEdit(
      //       {
      //         variables: { _id, tagIds },
      //         onError: (e: ApolloError) => {
      //           toast({
      //             title: 'Error',
      //             description: e.message,
      //           });
      //         },
      //       },
      //       ['tagIds'],
      //     );
      //   }}
    />
  );
};
