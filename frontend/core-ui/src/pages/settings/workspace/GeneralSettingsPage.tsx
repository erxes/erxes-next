import { SettingsBreadcrumbs } from '@/settings/components/SettingsBreadcrumbs';
import { GeneralSettings } from '@/settings/general/components/GeneralSettings';
import { IconBox } from '@tabler/icons-react';
import { ScrollArea } from 'erxes-ui/components';

export function GeneralSettingsPage() {
  return (
    <ScrollArea.Root>
      <section className="mx-auto max-w-2xl w-full relative">
        <SettingsBreadcrumbs
          breadcrumbs={[
            { title: 'Setting', path: 'settings', Icon: IconBox },
            { title: 'General', path: 'general', Icon: IconBox },
          ]}
        />
        <h2 className="font-semibold text-lg mt-4 mb-12 px-4">
          General settings
        </h2>
        <div className="flex flex-col gap-8 px-4 w-full h-auto">
          <GeneralSettings />
        </div>
      </section>
      <ScrollArea.Bar />
    </ScrollArea.Root>
  );
}
