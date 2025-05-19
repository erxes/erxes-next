import { ScrollArea } from 'erxes-ui';

import { ProfileForm } from '@/settings/profile/components/ProfileForm';
import { SettingsBreadcrumbs } from '@/settings/components/SettingsBreadcrumbs';

export const SettingsProfilePage = () => {
  return (
    <section className="mx-auto flex w-full h-screen relative">
      <section className="mx-auto max-w-2xl w-full overflow-y-auto pb-10">
        <div className="px-4 h-16 flex items-center">
          <SettingsBreadcrumbs />
        </div>
        <h2 className="font-semibold text-lg mt-4 mb-12 px-4">Profile</h2>
        <div className="flex flex-col gap-10 px-4">
          <ProfileForm />
        </div>
      </section>
    </section>
  );
};
