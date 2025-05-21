import React from 'react';
import {
  Icon,
  IconActivity,
  IconCalendarClock,
  IconFileDescription,
  IconMessage,
  IconX,
} from '@tabler/icons-react';
import { Button, Resizable, SideMenu, cn, useQueryState } from 'erxes-ui';
import { useAtom, useSetAtom } from 'jotai';
import { courseDetailActiveActionTabAtom } from '@/courses/detail/states/courseDetailStates';
import { CourseDetailGeneral } from '@/courses/detail/components/CourseDetailGeneral';
import { CourseAttendances } from '@/courses/detail/components/CourseAttendances';

const actionTabs = {
  detail: {
    title: 'Detail',
    icon: IconFileDescription,
    code: 'detail',
  },
  activity: {
    title: 'Activity',
    icon: IconActivity,
    code: 'activity',
  },
  comments: {
    title: 'Comments',
    icon: IconMessage,
    code: 'comments',
  },
  attendances: {
    title: 'Attendances',
    icon: IconCalendarClock,
    code: 'attendaces',
  },
};

export const CourseDetailActions = () => {
  const [activeTab, setActiveTab] = useAtom(courseDetailActiveActionTabAtom);
  const [courseId] = useQueryState<string>('courseId');

  return (
    <>
      <Resizable.Panel
        minSize={activeTab ? 30 : 0}
        maxSize={activeTab ? 60 : 0}
      >
        <SideMenu
          orientation="vertical"
          value={activeTab ?? ''}
          onValueChange={(value) => setActiveTab(value)}
          className={cn('h-full')}
        >
          <ActionTabsContent
            value={actionTabs.detail.code}
            icon={actionTabs.detail.icon}
            title={actionTabs.detail.title}
          >
            <CourseDetailGeneral />
          </ActionTabsContent>
          <ActionTabsContent
            value={actionTabs.activity.code}
            icon={actionTabs.activity.icon}
            title={actionTabs.activity.title}
          >
            <div className="flex-auto overflow-y-auto">Activity</div>
          </ActionTabsContent>
          <ActionTabsContent
            value={actionTabs.comments.code}
            icon={actionTabs.comments.icon}
            title={actionTabs.comments.title}
          >
            <div className="flex-auto overflow-y-auto">Comments</div>
          </ActionTabsContent>
          <ActionTabsContent
            value={actionTabs.attendances.code}
            icon={actionTabs.attendances.icon}
            title={actionTabs.attendances.title}
          >
            <CourseAttendances />
          </ActionTabsContent>
        </SideMenu>
      </Resizable.Panel>
      <CustomerDetailActionsTrigger />
    </>
  );
};

export const CustomerDetailActionsTrigger = () => {
  const [activeTab, setActiveTab] = useAtom(courseDetailActiveActionTabAtom);

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
      {/* <ActionHeader title={title} icon={icon} /> */}
      {children}
    </SideMenu.Content>
  );
};

export const ActionHeader = (props: { title?: string; icon: Icon }) => {
  const setActiveTab = useSetAtom(courseDetailActiveActionTabAtom);
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
