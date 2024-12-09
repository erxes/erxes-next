import { Breadcrumb, Header } from 'erxes-ui';
import { useRecoilValue } from 'recoil';

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
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
};
