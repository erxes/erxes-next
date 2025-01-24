import SettingsHeader from '@/settings/components/SettingsHeader';
import FileUploadForm from '@/settings/file-upload/components/FileUploadForm';
import { fileUploadHeader } from '@/settings/file-upload/constants/header';
import { ScrollArea } from 'erxes-ui/components';

export const FilePage = () => {
  return (
    <ScrollArea.Root>
      <section className="mx-auto max-w-2xl w-full relative">
        <SettingsHeader breadcrumbs={fileUploadHeader}/>
        <h2 className="font-semibold text-lg mt-4 mb-12 px-4">File Upload</h2>
        <div className="flex flex-col gap-8 px-4 w-full h-auto">
          <FileUploadForm />
        </div>
      </section>
      <ScrollArea.Bar />
    </ScrollArea.Root>
  );
}
