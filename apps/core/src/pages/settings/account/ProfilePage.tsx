import {
  Breadcrumb,
  Header,
  Upload,
  Label,
  Input,
  Button,
} from 'erxes-ui/components';

export const SettingsProfilePage = () => {
  return (
    <section className="mx-auto max-w-2xl w-full">
      <Header>
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link>Settings</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Page>Profile</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Header>
      <h2 className="font-semibold text-lg mt-4 mb-12 px-4">Profile</h2>
      <div className="flex flex-col gap-10 px-4">
        <div className="flex flex-col gap-4">
          <Label>Profile picture</Label>
          <Upload.Root>
            <Upload.Preview />

            <div className="flex flex-col gap-2">
              <div className="flex gap-4">
                <Upload.Button size="sm" variant="outline" />
                <Upload.RemoveButton size="sm" variant="outline" />
              </div>
              <p className="text-xs text-muted-foreground">
                Upload a profile picture to help identify you.
              </p>
            </div>
          </Upload.Root>
        </div>
        <div className="flex flex-col gap-3">
          <Label>Name</Label>
          <p className="text-xs text-muted-foreground">
            This is your public display name.
          </p>
          <div className="grid grid-cols-2 gap-6 mt-0.5">
            <div className="flex flex-col gap-2">
              <Label className="text-xs">First name</Label>
              <Input />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Last name</Label>
              <Input />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label>Email</Label>
          <p className="text-xs text-muted-foreground">
            This is your public email address.
          </p>
          <Input
            placeholder="dev@erxes.io"
            className="mt-1"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label>Change Password</Label>
          <p className="text-xs text-muted-foreground">
            Receive an email containing password update link
          </p>
          <div className="mt-1">
            <Button size="sm" variant="outline">
              Change password
            </Button>
          </div>
        </div>
        {/* <div className="flex flex-col gap-3">
          <Label>Danger zone</Label>
          <p className="text-xs text-muted-foreground">
            Delete account and all the associated data
          </p>
          <div className="mt-1">
            <Button size="sm" variant="destructive">
              Delete account
            </Button>
          </div>
        </div> */}
      </div>
    </section>
  );
};
