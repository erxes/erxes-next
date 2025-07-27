import { Tabs } from 'erxes-ui';

export const CallHistory = () => {
  return (
    <Tabs defaultValue="all">
      <Tabs.List className="grid grid-cols-2">
        <Tabs.Trigger value="all">All calls (15)</Tabs.Trigger>
        <Tabs.Trigger value="missed">Missed calls</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="all" className="h-96">
        hi
      </Tabs.Content>
      <Tabs.Content value="missed" className="h-96"></Tabs.Content>
    </Tabs>
  );
};
