import { ScrollArea } from 'erxes-ui/components';

import { ProfileForm } from '@/settings/profile/components/ProfileForm';
import { ProfileHeader } from '@/settings/profile/components/ProfileHeader';

export const SettingsProfilePage = () => {
  return (
    <ScrollArea>
      <section className="mx-auto max-w-2xl w-full overflow-y-auto pb-10">
        <ProfileHeader />
        <h2 className="font-semibold text-lg mt-4 mb-12 px-4">Profile</h2>
        <div className="flex flex-col gap-10 px-4">
          <ProfileForm />
        </div>
      </section>
    </ScrollArea>
  );
};
