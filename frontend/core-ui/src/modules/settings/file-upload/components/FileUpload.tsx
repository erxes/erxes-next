import React, { useEffect } from 'react';

import { IconLoader2 } from '@tabler/icons-react';
import { motion } from 'motion/react';

import { Button, Form, Label } from 'erxes-ui/components';

import { DynamicServiceConfigFields } from '@/settings/file-upload/components/DynamicServiceConfigFields';
import { FileUploadMainFields } from '@/settings/file-upload/components/FileUploadMainFields';
import { UploadServiceRadioGroup } from '@/settings/file-upload/components/UploadServiceRadioGroup';
import { FILE_MIME_TYPES } from '@/settings/file-upload/constants/serviceData';
import { serviceFields } from '@/settings/file-upload/constants/uploadServiceFields';
import { useConfig } from '@/settings/file-upload/hook/useConfigs';
import { useFileUploadForm } from '@/settings/file-upload/hook/useFileUploadForm';
import { TConfig, UploadConfigFormT } from '@/settings/file-upload/types';
import { Path } from 'react-hook-form';

type Option = {
  label: string;
  value: string;
};

const modifiedArray: Option[] = FILE_MIME_TYPES.map(
  ({ label, extension, value }) => ({
    label: `${label} (${extension})`,
    value: value,
  }),
);

const FileUpload = () => {
  const { form, onCompleted } = useFileUploadForm();
  const { updateConfig, isLoading, configs } = useConfig();

  const dynamicFields = React.useMemo(() => {
    const selectedType = form.watch('UPLOAD_SERVICE_TYPE');
    return serviceFields[selectedType]?.fields || [];
  }, [form.watch('UPLOAD_SERVICE_TYPE')]);

  const selected = React.useMemo(() => {
    const selectedType = form.watch('UPLOAD_SERVICE_TYPE');
    return selectedType;
  }, [form.watch('UPLOAD_SERVICE_TYPE')]);

  const onSubmit = (data: UploadConfigFormT) => {
    const updatedConfigs = configs.reduce((acc: any, config: TConfig) => {
      acc[config.code] = data[config.code] ?? config.value;
      return acc;
    }, {} as Record<string, any>);
    updateConfig(updatedConfigs);
  };

  useEffect(() => {
    if (configs !== undefined) {
      const values = configs.reduce((acc: any, config: any) => {
        acc[config.code] = config.value;
        return acc;
      }, {});

      const uploadFileTypes = values['UPLOAD_FILE_TYPES']?.split(',');
      const uploadFileTypesArray = FILE_MIME_TYPES.filter((item) =>
        uploadFileTypes.includes(item.value),
      ).map((item) => ({
        label: `${item.label} (${item.extension})`,
        value: item.value,
      }));

      const widgetsUploadFileTypes =
        values['WIDGETS_UPLOAD_FILE_TYPES']?.split(',');
      const widgetUploadFileTypesArray = FILE_MIME_TYPES.filter((item) =>
        widgetsUploadFileTypes.includes(item.value),
      ).map((item) => ({
        label: `${item.label} (${item.extension})`,
        value: item.value,
      }));

      form.reset({
        ...values,
        UPLOAD_FILE_TYPES: uploadFileTypesArray,
        WIDGETS_UPLOAD_FILE_TYPES: widgetUploadFileTypesArray,
      });
    }
  }, [configs, form]);

  return (
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
            className="w-full col-start-4"
          >
            <Button
              type="submit"
              size={'sm'}
              disabled={isLoading}
              className="w-full"
            >
              {(isLoading && <IconLoader2 className="animate-spin" />) ||
                'Update'}
            </Button>
          </motion.div>
        </div>
      </form>
    </Form>
  );
};

export default FileUpload;
