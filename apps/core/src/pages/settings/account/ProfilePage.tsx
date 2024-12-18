import { ScrollArea } from 'erxes-ui/components';
import ProfileHeader from '@/settings/profile/components/ProfileHeader';
import ProfileForm from '@/settings/profile/components/ProfileForm';

export const SettingsProfilePage = () => {
  return (
    <ScrollArea.Root>
      <section className="mx-auto max-w-2xl w-full overflow-y-auto pb-10">
        <ProfileHeader />
        <h2 className="font-semibold text-lg mt-4 mb-12 px-4">Profile</h2>
        <div className="flex flex-col gap-10 px-4">
          <ProfileForm />
        </div>
      </section>
    </ScrollArea.Root>
  );
};
