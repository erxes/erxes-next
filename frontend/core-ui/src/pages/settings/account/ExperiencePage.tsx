import { Breadcrumb, Input,Label } from 'erxes-ui/components';

import { ChooseTheme } from '@/settings/components/ChooseTheme';

export const SettingsExperiencePage = () => {
  return (
    <section className="mx-auto max-w-2xl w-full">
      <div>
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link>Settings</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.Page>Experience</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </div>
      <h2 className="font-semibold text-lg mt-4 mb-12 px-4">Experience</h2>
      <div className="flex flex-col gap-10 px-4">
        <div className="flex flex-col gap-4">
          <ChooseTheme />
        </div>
        <div className="flex flex-col gap-6">
          <Label>Date and time</Label>
          <p className="text-sm text-muted-foreground">
            Configure how dates are displayed across the app
          </p>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Time zone</Label>
            <Input />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Date format</Label>
            <Input />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Time format</Label>
            <Input />
          </div>
        </div>
      </div>
    </section>
  );
};
