import { Label, toast } from 'erxes-ui';

import { SelectTags } from 'ui-modules';
import { ApolloError } from '@apollo/client';

export const CustomerDetailSelectTag = ({
  tagIds,
  customerId,
}: {
  tagIds: string[];
  customerId: string;
}) => {
  return (
    <fieldset className="space-y-2 px-8">
      <Label asChild>
        <legend>Tags</legend>
      </Label>
      <SelectTags.Detail
        mode="multiple"
        tagType="core:customer"
        value={tagIds}
        targetIds={[customerId]}
        options={(newSelectedTagIds) => ({
          update: (cache) => {
          cache.modify({
            id: cache.identify({
              __typename: 'Customer',
              _id: customerId,
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
      />
    </fieldset>
  );
};
