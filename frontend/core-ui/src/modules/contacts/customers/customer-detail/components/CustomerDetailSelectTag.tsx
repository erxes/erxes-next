import { Button, Combobox, Label, Popover, toast } from 'erxes-ui';

import { SelectTags } from 'ui-modules';
import { IconPlus } from '@tabler/icons-react';
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
      <SelectTags.Provider
        tagType="core:customer"
        value={tagIds}
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
      >
        <Popover>
          <Popover.Trigger asChild>
            <Button variant="secondary">
              <IconPlus /> Add tags
            </Button>
          </Popover.Trigger>
          <Combobox.Content>
            <SelectTags.Content />
          </Combobox.Content>
        </Popover>
      </SelectTags.Provider>
    </fieldset>
  );
};
