import React from 'react';
import { Form, Resizable, Tabs } from 'erxes-ui';
import { MemberDetailSheet } from './MemberDetailSheet';
import { useSearchParams } from 'react-router';
import { useUsersForm } from '@/settings/team-member/hooks/useUserForm';
import { useUserDetail } from '@/settings/team-member/hooks/useUserDetail';

export const MemberDetailLayout = ({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  const { userDetail } = useUserDetail();
  const {
    methods,
    methods: { reset },
  } = useUsersForm();

  React.useEffect(() => {
    if (userDetail) {
      reset(userDetail);
    }
    return () => {};
  }, [userDetail]);

  return (
    <MemberDetailSheet>
      <Form {...methods}>
        <div className="flex h-auto flex-auto overflow-auto">
          <div className="flex flex-col flex-auto min-h-full overflow-hidden">
            <Resizable.PanelGroup
              direction="horizontal"
              className="flex-auto min-h-full overflow-hidden"
            >
              <Resizable.Panel defaultSize={75} minSize={30}>
                <MemberDetailTabs>{children}</MemberDetailTabs>
              </Resizable.Panel>

              {actions && (
                <>
                  <Resizable.Handle />
                  <Resizable.Panel defaultSize={25} minSize={20}>
                    {actions}
                  </Resizable.Panel>
                </>
              )}
            </Resizable.PanelGroup>
          </div>
        </div>
      </Form>
    </MemberDetailSheet>
  );
};

const MemberDetailTabs = ({ children }: { children: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTab = searchParams.get('tab') || 'general';

  const handleTabChange = (tab: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', tab);
    setSearchParams(newSearchParams);
  };
  return (
    <Tabs
      value={selectedTab}
      onValueChange={handleTabChange}
      className="flex-auto flex flex-col"
    >
      <Tabs.List className="h-12">
        <Tabs.Trigger value="general" className="text-base h-full">
          General
        </Tabs.Trigger>
        <Tabs.Trigger value="links" className="text-base h-full">
          Links
        </Tabs.Trigger>
        <Tabs.Trigger value="other" className="text-base h-full">
          Other
        </Tabs.Trigger>
      </Tabs.List>
      {children}
    </Tabs>
  );
};

export const MemberDetailTabContent = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) => {
  return (
    <Tabs.Content value={value} className="grow h-full overflow-auto">
      {children}
    </Tabs.Content>
  );
};
