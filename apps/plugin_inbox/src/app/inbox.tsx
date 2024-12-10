import { Breadcrumb, Header } from 'erxes-ui';

export const Inbox = () => {
  return (
    <>
      <Header>
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item className="hidden md:block">
              <Breadcrumb.Link href="/inbox">Team Inbox</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator className="hidden md:block" />
            <Breadcrumb.Item>
              <Breadcrumb.Page>Inbox</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        Inbox veersion 1.0.1ll
      </div>
    </>
  );
};
