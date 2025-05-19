import {
  Button,
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
} from 'erxes-ui';
import { IconTag } from '@tabler/icons-react';
import { SelectTags } from 'ui-modules';
import { useState } from 'react';
import { ICustomer } from '@/contacts/types/customerType';
import { useGiveTags } from 'ui-modules/modules/tags/hooks/useGiveTags';
export const CustomersTag = ({customers}: {customers: ICustomer[]}) => {
  const [open, setOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { giveTags } = useGiveTags();
  return (
    <SelectTags
      tagType="core:customer"
      mode="multiple"
      value={selectedTags}
      onValueChange={(tags) => {
        if (Array.isArray(tags)) {
          tags && setSelectedTags([...selectedTags, ...tags]);
        } else {
          if (tags) {
            if (selectedTags.includes(tags)) {
              setSelectedTags(selectedTags.filter((tag) => tag !== tags));
            } else {
              setSelectedTags([...selectedTags, tags]);
            }
          }
        }
      }}
    >
      <RecordTablePopover open={open} onOpenChange={setOpen}>
        <Button variant={'secondary'} asChild>
          <RecordTableCellTrigger>
            <IconTag />
            Tag
          </RecordTableCellTrigger>
        </Button>
        <RecordTableCellContent className="w-96">
          <SelectTags.Content />
        </RecordTableCellContent>
      </RecordTablePopover>
    </SelectTags>
  );
};
