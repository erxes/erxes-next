import { ScrollArea } from 'erxes-ui';

import { ProfileForm } from '@/settings/profile/components/ProfileForm';
import { SettingsBreadcrumbs } from '@/settings/components/SettingsBreadcrumbs';
import { IconBox } from '@tabler/icons-react';

const breadcrumbs = [
  { title: 'Settings', path: 'settings', Icon: IconBox },
  { title: 'Profile', path: 'profile', Icon: IconBox },
];

export const SettingsProfilePage = () => {
  return (
    <ScrollArea>
      <section className="mx-auto max-w-2xl w-full overflow-y-auto pb-10">
        <SettingsBreadcrumbs breadcrumbs={breadcrumbs} />
        <h2 className="font-semibold text-lg mt-4 mb-12 px-4">Profile</h2>
        <div className="flex flex-col gap-10 px-4">
          <ProfileForm />
        </div>
      </section>
    </ScrollArea>
  );
};
