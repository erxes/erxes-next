import { Combobox, Popover, toast } from 'erxes-ui';
import { ApolloError } from '@apollo/client';
import { SelectTags, SelectTagsProps } from 'ui-modules';

interface TagsField extends SelectTagsProps {
  _id: string;
}

export const TagsField = ({ _id, tagType, selected }: TagsField) => {
  return (
    <SelectTags
      tagType={tagType}
      value={selected as string[]}
      mode="multiple"
      targetIds={[_id]}
      options={(newSelectedTagIds) => ({
        update: (cache) => {
          cache.modify({
            id: cache.identify({
              __typename: 'Customer',
              _id,
            }),
            fields: { tagIds: () => newSelectedTagIds },
          });
        },
        onError: (e: ApolloError) => {
          toast({
            title: 'Error',
            description: e.message,
          });
        },
      })}
    >
      <Popover>
        <Combobox.Trigger>
          <SelectTags.Value />
        </Combobox.Trigger>
        <Combobox.Content>
          <SelectTags.Content />
        </Combobox.Content>
      </Popover>
    </SelectTags>
  );
};
