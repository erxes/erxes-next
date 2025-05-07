import React from 'react';
import { Icon, IconActivity, IconNote, IconX } from '@tabler/icons-react';
import {
  Button,
  Resizable,
  SideMenu,
  Tabs,
  Tooltip,
  cn,
  useQueryState,
} from 'erxes-ui';
import { customerDetailActiveActionTabAtom } from '@/contacts/states/customerDetailStates';
import { ActivityLogs } from '@/activity-logs/components/ActivityLogs';
import { AddInternalNotes } from '@/internal-notes/components/AddInternalNotes';
import { useAtom, useSetAtom } from 'jotai';
import { useWidget } from 'ui-modules';

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

export const CustomerDetailActions = () => {
  // const [activeTab, setActiveTab] = useAtom(customerDetailActiveActionTabAtom);
  const [contactId] = useQueryState<string>('contactId');
  const { Widget } = useWidget();

  return <Widget contentType="core:customer" contentId={contactId || ''} />;

  // return (
  //   <>
  //     <Resizable.Handle />
  //     <Resizable.Panel
  //       minSize={activeTab ? 30 : 0}
  //       maxSize={activeTab ? 60 : 0}
  //     >
  {
    /* <SideMenu
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
        </SideMenu> */
  }
  {
    /* <Widget contentType="core:customer" contentId={contactId || ''} />
      </Resizable.Panel>
      <CustomerDetailActionsTrigger /> */
  }
  {
    /* </> */
  }
  {
    /* ); */
  }
};

export const CustomerDetailActionsTrigger = () => {
  const [activeTab, setActiveTab] = useAtom(customerDetailActiveActionTabAtom);

  return (
    <div className="flex flex-none overflow-hidden">
      <SideMenu
        orientation="vertical"
        value={activeTab ?? ''}
        onValueChange={(value) => setActiveTab(value)}
        className="h-full"
      >
        <SideMenu.Sidebar className="border-l-0">
          {Object.values(actionTabs).map((tab) => (
            <SideMenu.Trigger
              key={tab.code}
              value={tab.code}
              label={tab.title}
              Icon={tab.icon}
            />
          ))}
        </SideMenu.Sidebar>
      </SideMenu>
    </div>
  );
};

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
  // const [activeTab] = useAtom(customerDetailActiveActionTabAtom);

  return (
    <SideMenu.Content
      value={value}
      className="border-l-0 data-[state=active]:border-l-0 bg-background"
    >
      <ActionHeader title={title} icon={icon} />
      {children}
    </SideMenu.Content>
  );
};

export const ActionHeader = (props: { title?: string; icon: Icon }) => {
  const setActiveTab = useSetAtom(customerDetailActiveActionTabAtom);
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
