import ChangePasswordForm from '@/settings/privacy/components/ChangePasswordForm';
import PrivacyHeader from '@/settings/privacy/components/PrivacyHeader';
import { ScrollArea } from 'erxes-ui/components';

export const SettingsPrivacyPage = () => {
  return (
    <ScrollArea.Root>
      <section className="mx-auto max-w-2xl w-full overflow-y-auto pb-10">
        <PrivacyHeader />
        <h2 className="font-semibold text-lg mt-4 mb-12 px-4">
          Privacy & Security
        </h2>
        <div className="flex flex-col gap-10 px-4">
          <ChangePasswordForm />
        </div>
      </section>
    </ScrollArea.Root>
  );
};
