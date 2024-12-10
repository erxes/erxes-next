import { Breadcrumb, Header } from 'erxes-ui';

const Settings = () => {
  return (
    <>
      <Header>
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item className="hidden md:block">
              <Breadcrumb.Link href="/settings">Settings</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator className="hidden md:block" />

            <Breadcrumb.Item>
              <Breadcrumb.Page>Team Inbox</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        Inbox settings veersion 1.0.0 EJTESt
      </div>
    </>
  );
};

export default Settings;
