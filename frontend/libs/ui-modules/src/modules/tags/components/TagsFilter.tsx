import { IconTags } from '@tabler/icons-react';
import {
  Combobox,
  Filter,
  Popover,
  useFilterContext,
  useQueryState,
} from 'erxes-ui';
import { SelectTags } from './SelectTags';
import { useState } from 'react';

const TagsFilterCommandItem = () => {
  return (
    <Filter.Item value="tags">
      <IconTags />
      Tags
    </Filter.Item>
  );
};

export const TagsFilterView = ({ tagType }: { tagType: string }) => {
  const [tags, setTags] = useQueryState<string[]>('tags');
  const { resetFilterState } = useFilterContext();
  return (
    <Filter.View filterKey="tags">
      <SelectTags
        tagType={tagType}
        mode="multiple"
        value={tags || []}
        onValueChange={(tags) => {
          setTags(tags as string[]);
          resetFilterState();
        }}
      >
        <SelectTags.Content />
      </SelectTags>
    </Filter.View>
  );
};

const TagsFilterBar = ({ tagType }: { tagType: string }) => {
  const [tags, setTags] = useQueryState<string[]>('tags');
  const [open, setOpen] = useState(false);

  if (!tags || !tags.length) {
    return null;
  }

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconTags />
        Tags
      </Filter.BarName>
      <SelectTags
        tagType={tagType}
        value={tags || []}
        mode="multiple"
        onValueChange={(tags) => {
          setTags(tags as string[]);
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Filter.BarButton
              filterKey="tags"
              className="max-w-72 overflow-hidden justify-start"
            >
              <SelectTags.List />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content className="w-72">
            <SelectTags.Content />
          </Combobox.Content>
        </Popover>
      </SelectTags>
      <Filter.BarClose filterKey="tags" />
    </Filter.BarItem>
  );
};

export const TagsFilter = Object.assign(TagsFilterCommandItem, {
  Bar: TagsFilterBar,
  View: TagsFilterView,
});
