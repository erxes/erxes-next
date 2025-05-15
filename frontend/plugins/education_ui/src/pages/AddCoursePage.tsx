import {
  Button,
  Form,
  Resizable,
  Preview,
  Separator,
  Tabs,
  useQueryState,
  Sidebar,
} from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { IconX } from '@tabler/icons-react';
import { CourseAddCoreFields } from '@/courses/add-course/components/CourseAddCoreFields';
import {
  courseFormSchema,
  CourseFormType,
} from '@/courses/add-course/components/formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import * as TabsPrimitive from '@radix-ui/react-tabs';

const AddCoursePage = () => {
  const form = useForm<CourseFormType>({
    resolver: zodResolver(courseFormSchema),
  });

  const steps = [
    {
      key: 'general',
      label: 'General Information',
      component: CourseAddCoreFields,
    },
    { key: 'class', label: 'Class, Schedule' },
    { key: 'payment', label: 'Payment, Location' },
    { key: 'teacher', label: 'Teacher' },
  ];

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <div className="flex justify-between items-center p-6">
        <h2 className="text-lg font-semibold">Хөтөлбөр үүсгэх</h2>
        <div className="w-[28px] h-[28px] bg-gray-200 flex items-center justify-center rounded-sm">
          <IconX size={16} />
        </div>
      </div>
      <Separator />
      <Resizable.PanelGroup direction="horizontal" className="flex-1 h-screen">
        <Resizable.Panel minSize={20} defaultSize={50}>
          <div className="p-6 max-w-2xl mx-auto">
            <CourseAddTabs>
              {steps?.map((step) => {
                return (
                  <CourseAddTabContent value={step.label}>
                    <div></div>
                    {/* {step.component} */}
                  </CourseAddTabContent>
                );
              })}
            </CourseAddTabs>

            <h2 className="text-lg font-semibold">Үндсэн мэдээлэл оруулах</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <CourseAddCoreFields form={form} />

                <div className="flex w-full justify-between mt-6">
                  <Button variant="outline">Cancel</Button>
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground"
                    // loading={loading}
                  >
                    Save
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </Resizable.Panel>

        <Resizable.Handle />

        <Resizable.Panel minSize={20} defaultSize={50}>
          <div className="flex justify-center items-center flex-col p-6 gap-6">
            <h2 className="text-lg font-semibold">Урьдчилан харах</h2>
            <Preview>
              <Preview.Toolbar path={'/courses/add-course'} />
              <Preview.View
                iframeSrc="/iframe.html?id=components-dialog--default"
                height={400}
              />
            </Preview>
          </div>
        </Resizable.Panel>
      </Resizable.PanelGroup>
    </>
  );
};

export default AddCoursePage;

const CourseAddTabs = ({ children }: { children: React.ReactNode }) => {
  const [selectedTab, setSelectedTab] = useQueryState<string>('tab');

  return (
    <Tabs
      value={selectedTab ?? 'overview'}
      onValueChange={setSelectedTab}
      className="flex-auto flex h-full"
      orientation="vertical"
    >
      <TabsPrimitive.List className="w-64" asChild>
        <Sidebar collapsible="none" className="flex-none w-64 border-r">
          <Sidebar.Group>
            <Sidebar.GroupLabel>General</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <TabsPrimitive.Trigger value="overview" asChild>
                    <Sidebar.MenuButton className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                      Overview
                    </Sidebar.MenuButton>
                  </TabsPrimitive.Trigger>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <TabsPrimitive.Trigger value="plugins" asChild>
                    <Sidebar.MenuButton>Plugins</Sidebar.MenuButton>
                  </TabsPrimitive.Trigger>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <TabsPrimitive.Trigger value="properties" asChild>
                    <Sidebar.MenuButton>Properties</Sidebar.MenuButton>
                  </TabsPrimitive.Trigger>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
          <Sidebar.Separator />
          <Sidebar.Group></Sidebar.Group>
        </Sidebar>
        {/* <Tabs.VerticalTrigger value="overview">Overview</Tabs.VerticalTrigger>
        <Tabs.VerticalTrigger value="plugins">Plugins</Tabs.VerticalTrigger>
        <Tabs.VerticalTrigger value="properties">
          Properties
        </Tabs.VerticalTrigger> */}
      </TabsPrimitive.List>
      {children}
    </Tabs>
  );
};

export const CourseAddTabContent = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) => {
  return (
    <Tabs.Content value={value} className="flex-auto overflow-hidden">
      {children}
    </Tabs.Content>
  );
};
