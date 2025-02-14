import { Icon, IconActivity, IconNote, IconX } from '@tabler/icons-react';
import { Button, Resizable, Tabs, Tooltip } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib/utils';
import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { contactDetailActiveActionTabAtom } from '@/contacts/detail/states/contactDetailStates';
import { ActivityLogs } from '@/activity-logs/components/ActivityLogs';
import { useQueryState } from 'nuqs';
import { AddInternalNotes } from '@/internal-notes/components/AddInternalNotes';

const actionTabs = {
  activity: {
    title: 'Activity',
    icon: IconActivity,
    code: 'activity',
  },
  notes: {
    title: 'Internal Notes',
    icon: IconNote,
    code: 'notes',
  },
};

export const ContactDetailActions = () => {
  const [activeTab, setActiveTab] = useRecoilState(
    contactDetailActiveActionTabAtom,
  );
  const [contactId] = useQueryState('contact_id');

  return (
    <>
      <Resizable.Handle />
      <Resizable.Panel
        minSize={activeTab ? 30 : 0}
        maxSize={activeTab ? 60 : 0}
      >
        <Tabs
          orientation="vertical"
          value={activeTab ?? ''}
          onValueChange={(value) => setActiveTab(value)}
          className={cn('h-full')}
        >
          <ActionTabsContent
            value={actionTabs.activity.code}
            icon={actionTabs.activity.icon}
            title={actionTabs.activity.title}
          >
            <div className="flex-auto overflow-y-auto">
              <ActivityLogs
                operation={{
                  variables: {
                    contentType: 'core:customers',
                    contentId: contactId,
                  },
                  skip: !contactId,
                }}
              />
            </div>
          </ActionTabsContent>
          <ActionTabsContent
            value={actionTabs.notes.code}
            icon={actionTabs.notes.icon}
            title={actionTabs.notes.title}
          >
            <Resizable.PanelGroup direction="vertical" className="flex-auto">
              <Resizable.Panel className="!overflow-y-auto">
                <ActivityLogs
                  operation={{
                    variables: {
                      contentType: 'core:customer',
                      contentId: contactId,
                      activityType: 'core:internalNote',
                    },
                    skip: !contactId,
                  }}
                />
              </Resizable.Panel>
              <Resizable.Handle />
              <Resizable.Panel minSize={25} maxSize={60}>
                <AddInternalNotes
                  contentTypeId={contactId || ''}
                  contentType="core:customer"
                />
              </Resizable.Panel>
            </Resizable.PanelGroup>
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
          {Object.values(actionTabs).map((tab) => (
            <ActionTrigger
              key={tab.code}
              value={tab.code}
              label={tab.title}
              icon={tab.icon}
            />
          ))}
        </Tabs.List>
      </Tabs>
    </div>
  );
};

export const ActionTrigger = React.forwardRef<
  React.ElementRef<typeof Tabs.Trigger>,
  React.ComponentPropsWithoutRef<typeof Tabs.Trigger> & {
    label?: string;
    icon?: Icon;
  }
>(({ className, ...props }, ref) => (
  <Tooltip.Provider>
    <Tooltip delayDuration={100}>
      <Tooltip.Trigger asChild>
        <Tabs.Trigger
          ref={ref}
          className={cn(
            'h-12 w-12 bg-sidebar data-[state=active]:bg-primary/10 data-[state=active]:text-foreground data-[state=active]:shadow-none [&_svg]:size-5 [&_svg]:text-primary hover:bg-primary/10',
            className,
          )}
          {...props}
        >
          {props.icon && <props.icon className="size-5" />}
        </Tabs.Trigger>
      </Tooltip.Trigger>
      <Tooltip.Content side="left">{props.label}</Tooltip.Content>
    </Tooltip>
  </Tooltip.Provider>
));

export const ActionTabsContent = ({
  children,
  value,
  title,
  icon,
}: {
  children: React.ReactNode;
  value: string;
  title?: string;
  icon: Icon;
}) => {
  const activeTab = useRecoilValue(contactDetailActiveActionTabAtom);
  return (
    <Tabs.Content
      value={value}
      className={cn('flex flex-col overflow-hidden h-full', {
        hidden: activeTab !== value,
      })}
    >
      <ActionHeader title={title} icon={icon} />
      {children}
    </Tabs.Content>
  );
};

export const ActionHeader = (props: { title?: string; icon: Icon }) => {
  const setActiveTab = useSetRecoilState(contactDetailActiveActionTabAtom);
  return (
    <div className="flex items-center h-12 border-b px-6 text-primary gap-2 flex-none">
      <props.icon className="size-5" />
      <h4 className="font-semibold text-base">{props.title}</h4>
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
