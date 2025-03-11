import { useState } from 'react';

import { Label } from 'erxes-ui/components';

import { SelectTags, useGiveTags } from 'ui-modules';
import { useQueryState } from 'nuqs';

export const ContactDetailSelectTag = ({ tagIds }: { tagIds: string[] }) => {
  const [contactId] = useQueryState('contact_id');
  const { giveTags, loading } = useGiveTags();
  const [selectedTags, setSelectedTags] = useState<string[]>(tagIds);

  const handleGiveTags = (tags: string[]) => {
    giveTags({
      variables: {
        type: 'core:customer',
        targetIds: [contactId],
        tagIds: tags,
      },
      refetchQueries: ['activityLogs'],
      updateQueries: {
        customerDetail: (prev) => {
          return {
            customerDetail: Object.assign({}, prev.customerDetail, {
              tagIds: tags,
            }),
          };
        },
      },
    });
  };

  return (
    <fieldset className="space-y-2 px-8">
      <Label asChild>
        <legend>Tags</legend>
      </Label>
      <SelectTags
        tagType="core:customer"
        selected={selectedTags}
        loading={loading}
        recordId={contactId || ''}
        onSelect={(tags) => {
          setSelectedTags(tags as string[]);
          handleGiveTags(tags as string[]);
        }}
      />
    </fieldset>
  );
};
