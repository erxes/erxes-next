import { IconActivity, IconNote, IconX } from '@tabler/icons-react';
import { Button, Resizable, Tabs, Tooltip } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib/utils';
import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { contactDetailActiveActionTabAtom } from '@/contacts/detail/states/contactDetailStates';
import { ActivityLogs } from '@/activity-logs/components/ActivityLogs';
import { useQueryState } from 'nuqs';

export const ContactDetailActions = () => {
  const [activeTab, setActiveTab] = useRecoilState(
    contactDetailActiveActionTabAtom,
  );
  const [contactId] = useQueryState('contact_id');

  return (
    <>
      <Resizable.Handle />
      <Resizable.Panel
        minSize={activeTab ? 25 : 0}
        maxSize={activeTab ? 60 : 0}
      >
        <Tabs
          orientation="vertical"
          value={activeTab ?? ''}
          onValueChange={(value) => setActiveTab(value)}
          className={cn('h-full')}
        >
          <ActionTabsContent value="activity">
            <ActivityLogs
              operation={{
                variables: {
                  contentType: 'core:customers',
                  contentId: contactId,
                },
                skip: !contactId,
              }}
            />
          </ActionTabsContent>
        </Tabs>
      </Resizable.Panel>
    </>
  );
};

export const ContactDetailActionsTrigger = () => {
  const [activeTab, setActiveTab] = useRecoilState(
    contactDetailActiveActionTabAtom,
  );

  return (
    <div className="flex flex-none overflow-hidden">
      <Tabs
        orientation="vertical"
        value={activeTab ?? ''}
        onValueChange={(value) => setActiveTab(value)}
        className="h-full"
      >
        <Tabs.List className="flex-col h-full w-16 bg-sidebar p-3 justify-start rounded-none order-1 gap-3">
          <ActionTrigger value="activity" label="Activity">
            <IconActivity />
          </ActionTrigger>
          <ActionTrigger value="notes" label="Internal Notes">
            <IconNote />
          </ActionTrigger>
        </Tabs.List>
      </Tabs>
    </div>
  );
};

export const ActionTrigger = React.forwardRef<
  React.ElementRef<typeof Tabs.Trigger>,
  React.ComponentPropsWithoutRef<typeof Tabs.Trigger> & {
    label?: string;
  }
>(({ className, ...props }, ref) => (
  <Tooltip.Provider>
    <Tooltip delayDuration={100}>
      <Tooltip.Trigger>
        <Tabs.Trigger
          ref={ref}
          className={cn(
            'h-12 w-12 bg-sidebar data-[state=active]:bg-primary/10 data-[state=active]:text-foreground data-[state=active]:shadow-none [&_svg]:size-5 [&_svg]:text-primary hover:bg-primary/10',
            className,
          )}
          {...props}
        />
      </Tooltip.Trigger>
      <Tooltip.Content side="left">{props.label}</Tooltip.Content>
    </Tooltip>
  </Tooltip.Provider>
));

export const ActionTabsContent = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) => {
  return (
    <Tabs.Content
      value={value}
      className="flex flex-col overflow-hidden h-full"
    >
      <ActionHeader />
      <div className="flex-auto overflow-y-auto">{children}</div>
    </Tabs.Content>
  );
};

export const ActionHeader = () => {
  const setActiveTab = useSetRecoilState(contactDetailActiveActionTabAtom);
  return (
    <div className="flex items-center h-14 border-b border-input px-6 text-primary gap-2 flex-none">
      <IconActivity className="size-5" />
      <h4 className="font-semibold text-base">Activity</h4>
      <Button
        variant="secondary"
        size="icon"
        className="ml-auto"
        onClick={() => setActiveTab('')}
      >
        <IconX />
      </Button>
    </div>
  );
};
