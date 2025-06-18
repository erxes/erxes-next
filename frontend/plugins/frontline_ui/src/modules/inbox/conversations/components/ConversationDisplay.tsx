import { inboxLayoutState } from '@/inbox/states/inboxLayoutState';
import { IconLayoutColumns, IconList } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { useAtom } from 'jotai';

export const ConversationDisplay = () => {
  const [view, setView] = useAtom(inboxLayoutState);

  const Icon = view === 'split' ? IconLayoutColumns : IconList;

  return (
    <Button
      variant="ghost"
      onClick={() => setView(view === 'split' ? 'list' : 'split')}
    >
      <Icon size={20} />
    </Button>
  );
};

// eslint-disable-next-line no-lone-blocks
{
  /* <ToggleGroup
  type="single"
  className="p-1"
  value={view || 'list'}
  onValueChange={setView}
>
  <ToggleGroup.Item
    value="split"
    className="h-14 flex-col flex-auto gap-1 [&_svg]:size-5 text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground"
    variant="default"
  >
    <IconLayoutColumns />
    Split view
  </ToggleGroup.Item>
  <ToggleGroup.Item
    value="list"
    className="h-14 flex-col flex-auto gap-1 [&_svg]:size-5 text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground"
    variant="default"
  >
    <IconList />
    List view
  </ToggleGroup.Item>
</ToggleGroup>; */
}
