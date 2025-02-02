import { useState } from 'react';

import { Label } from 'erxes-ui/components';

import { SelectTags } from '@/tags/components/SelectTags';

export const ContactDetailSelectTag = ({ tagIds }: { tagIds: string[] }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(tagIds);
  
  return (
  <fieldset className="space-y-2 px-8">
   <Label asChild>
    <legend>Tags</legend>
   </Label>
    <SelectTags tagType='core:customer' selected={selectedTags} onSelect={(tags) => setSelectedTags(tags)} />
  </fieldset>
  );
};
