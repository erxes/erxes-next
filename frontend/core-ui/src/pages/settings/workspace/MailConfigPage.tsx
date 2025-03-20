import { SettingsBreadcrumbs } from '@/settings/components/SettingsBreadcrumbs';
import { MailConfigForm } from '@/settings/mail-config/components/MailConfigForm';
import { IconBox } from '@tabler/icons-react';
import { ScrollArea } from 'erxes-ui';

export function MailConfigPage() {
  return (
    <ScrollArea.Root>
      <section className="mx-auto max-w-2xl w-full relative">
        <div className="px-4 h-16 flex items-center">
          <SettingsBreadcrumbs />
        </div>
        <h2 className="font-semibold text-lg mt-4 mb-12 px-4">Mail service</h2>
        <div className="flex flex-col gap-8 px-4 w-full h-auto">
          <MailConfigForm />
        </div>
      </section>
      <ScrollArea.Bar />
    </ScrollArea.Root>
  );
}
