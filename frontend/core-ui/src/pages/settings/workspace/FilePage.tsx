import { useMemo } from 'react';

import { IconLoader2 } from '@tabler/icons-react';
import { motion } from 'motion/react';

import {
  Breadcrumb,
  Button,
  Form,
  Label,
  ScrollArea,
} from 'erxes-ui/components';

import { DynamicServiceConfigFields } from '@/settings/file-upload/components/DynamicServiceConfigFields';
import { FileUploadMainFields } from '@/settings/file-upload/components/FileUploadMainFields';
import { UploadServiceRadioGroup } from '@/settings/file-upload/components/UploadServiceRadioGroup';
import { FILE_MIME_TYPES } from '@/settings/file-upload/constants/serviceData';
import { serviceFields } from '@/settings/file-upload/constants/uploadServiceFields';
import { useConfig } from '@/settings/file-upload/hook/useConfigs';
import { useFileUploadForm } from '@/settings/file-upload/hook/useFileUploadForm';
import { UploadConfigFormT } from '@/settings/file-upload/types';

type Option = {
  label: string;
  value: string;
};

const modifiedArray: Option[] = FILE_MIME_TYPES.map(
  ({ label, extension, value }) => ({
    label: `${label} (${extension})`,
    value: value,
  })
);

export function FilePage() {
  const { form, onCompleted } = useFileUploadForm();
  const { updateConfig, isLoading } = useConfig({ onCompleted });

  const dynamicFields = useMemo(() => {
    const selectedType = form.watch('UPLOAD_SERVICE_TYPE');
    return serviceFields[selectedType]?.fields || [];
  }, [form.watch('UPLOAD_SERVICE_TYPE')]);

  const selected = useMemo(() => {
    const selectedType = form.watch('UPLOAD_SERVICE_TYPE');
    return selectedType;
  }, [form.watch('UPLOAD_SERVICE_TYPE')]);

  const onSubmit = (data: UploadConfigFormT) => {
    console.log(data, 'onSubmit');
    updateConfig(data);
  };

  return (
    <ScrollArea.Root>
      <section className="mx-auto max-w-2xl w-full relative">
        <div className="">
          <Breadcrumb.Root>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link>Settings</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page>File upload</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </div>
        <h2 className="font-semibold text-lg mt-4 mb-12 px-4">File Upload</h2>
        <div className="flex flex-col gap-8 px-4 w-full h-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-6"
            >
              <FileUploadMainFields form={form} modifiedArray={modifiedArray} />
              <Label>Upload Service Type</Label>

              <UploadServiceRadioGroup selected={selected} form={form} />

              <DynamicServiceConfigFields
                dynamicFields={dynamicFields}
                selected={selected}
                form={form}
              />

              <div className="grid grid-cols-4 py-4 col-start-3 gap-2 w-full">
                <motion.div
                  whileTap={{ scale: 0.975 }}
                  className="w-full col-start-3"
                >
                  <Button
                    type="reset"
                    variant={'destructive'}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.975 }} className="w-full">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {(isLoading && <IconLoader2 className="animate-spin" />) ||
                      'Update'}
                  </Button>
                </motion.div>
              </div>
            </form>
          </Form>
        </div>
      </section>
      <ScrollArea.Bar />
    </ScrollArea.Root>
  );
}
