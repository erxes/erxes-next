import { SettingsBreadcrumbs } from '@/settings/components/SettingsBreadcrumbs';
import FileUpload from '@/settings/file-upload/components/FileUpload';
import { IconBox } from '@tabler/icons-react';
import { ScrollArea } from 'erxes-ui';

export function FilePage() {
  return (
    <ScrollArea>
      <section className="mx-auto max-w-2xl w-full relative">
        <div className="px-4 h-16 flex items-center">
          <SettingsBreadcrumbs />
        </div>
        <h2 className="font-semibold text-lg mt-4 mb-12 px-4">File Upload</h2>
        <div className="flex flex-col gap-8 px-4 w-full h-auto">
          <FileUpload />
        </div>
      </section>
      <ScrollArea.Bar />
    </ScrollArea>
  );
}
