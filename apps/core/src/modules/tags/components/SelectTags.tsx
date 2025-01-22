import { useTags } from '@/tags/hooks/useTags';
import { IconChevronLeft, IconCirclePlus } from '@tabler/icons-react';
import { Badge, Button, Command, Popover, Tabs } from 'erxes-ui/components';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { CreateTagForm } from './CreateTagForm';

export const SelectTags = ({ type }: { type: string }) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [activeTab, setActiveTab] = useState('tags');
  const { tags, loading } = useTags({
    variables: {
      type,
      searchValue: debouncedSearch,
    },
  });
  return (
    <div className="flex p-8">
      {/* {loading ? (
        <div>Loading...</div>
      ) : (
        <MultipleSelector
          options={
            tags?.map((tag) => ({ value: tag._id, label: tag.name })) || []
          }
        />
      )} */}
      <Popover>
        <Popover.Trigger>
          <div>hi</div>
        </Popover.Trigger>
        <Popover.Content className="p-0">
          <Tabs
            defaultValue="tags"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <Tabs.Content value="tags">
              <Command className="outline-none" shouldFilter={false}>
                <div className="flex items-center pr-1">
                  <Command.Input
                    placeholder="Search tags"
                    wrapperClassName="flex-auto"
                    variant="secondary"
                    value={search}
                    onValueChange={(value) => setSearch(value)}
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setActiveTab('create')}
                    className="h-8 w-8"
                  >
                    <IconCirclePlus className="w-4 h-4" />
                  </Button>
                </div>
                <Command.List className="h-[300px]">
                  <Command.Empty>
                    No results found.
                    <Button
                      variant="secondary"
                      onClick={() => setActiveTab('create')}
                    >
                      Create new tag
                    </Button>
                  </Command.Empty>

                  {tags?.map((tag) => (
                    <Command.Item
                      key={tag._id}
                      value={tag._id}
                      className="p-0.5"
                    >
                      <Badge color={tag.color} className="gap-2">
                        <span
                          className="rounded-full w-2 h-2"
                          style={{ backgroundColor: tag.colorCode }}
                        ></span>
                        {tag.name}
                      </Badge>
                    </Command.Item>
                  ))}
                </Command.List>
              </Command>
            </Tabs.Content>
            <Tabs.Content value="create">
              <div className="h-[340px] p-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setActiveTab('tags')}
                    size="icon"
                  >
                    <IconChevronLeft className="w-4 h-4" />
                  </Button>
                  <h6 className="text-sm font-medium">Create new tag</h6>
                </div>
                <CreateTagForm />
              </div>
            </Tabs.Content>
          </Tabs>
        </Popover.Content>
      </Popover>
    </div>
  );
};
