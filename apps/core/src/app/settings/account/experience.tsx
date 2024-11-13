import ChooseTheme from '@/settings/components/ChooseTheme';
import { Breadcrumb, Header, Upload, Label, Input, Button } from 'erxes-ui';

export const SettingsExperience = () => {
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
              <Breadcrumb.Page>Experience</Breadcrumb.Page>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Header>
      <h2 className="font-semibold text-lg mt-4 mb-12 px-4">Experience</h2>
      <div className="flex flex-col gap-10 px-4">
        <div className="flex flex-col gap-4">
          <ChooseTheme />
        </div>
      </div>
    </section>
  );
};
