import React, { useEffect } from 'react';

import { IconLoader2 } from '@tabler/icons-react';
import { motion } from 'motion/react';

import { Button, Form, Label } from 'erxes-ui';

import { DynamicServiceConfigFields } from '@/settings/file-upload/components/DynamicServiceConfigFields';
import { FileUploadMainFields } from '@/settings/file-upload/components/FileUploadMainFields';
import { UploadServiceRadioGroup } from '@/settings/file-upload/components/UploadServiceRadioGroup';
import { FILE_MIME_TYPES } from '@/settings/file-upload/constants/serviceData';
import { SERVICE_FIELDS } from '@/settings/file-upload/constants/uploadServiceFields';
import { useConfig } from '@/settings/file-upload/hook/useConfigs';
import { useFileUploadForm } from '@/settings/file-upload/hook/useFileUploadForm';
import { TConfig, UploadConfigFormT } from '@/settings/file-upload/types';

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
  const { form } = useFileUploadForm();
  const { updateConfig, isLoading, configs } = useConfig();

  const dynamicFields = React.useMemo(() => {
    const selectedType = form.watch('UPLOAD_SERVICE_TYPE');
    return SERVICE_FIELDS[selectedType]?.fields || [];
  }, [form.watch('UPLOAD_SERVICE_TYPE')]);

  const selected = React.useMemo(() => {
    const selectedType = form.watch('UPLOAD_SERVICE_TYPE');
    return selectedType;
  }, [form.watch('UPLOAD_SERVICE_TYPE')]);

  const onSubmit = (data: UploadConfigFormT) => {
    const updatedConfigs = configs.reduce((acc: any, config: TConfig) => {
      if (
        config.code === 'UPLOAD_FILE_TYPES' ||
        config.code === 'WIDGETS_UPLOAD_FILE_TYPES'
      ) {
        const selectedOptions = data[config.code];
        const mimeTypes = selectedOptions.map((option: Option) => option.value);
        acc[config.code] = mimeTypes.join(',');
      } else {
        acc[config.code] = data[config.code] ?? config.value;
      }
      return acc;
    }, {} as Record<string, any>);

    updateConfig(updatedConfigs);
  };

  useEffect(() => {
    if (!configs) {
      form.reset();
    } else {
      const values = configs.reduce((acc: any, config: any) => {
        if (
          config.code === 'UPLOAD_FILE_TYPES' ||
          config.code === 'WIDGETS_UPLOAD_FILE_TYPES'
        ) {
          const selectedMimeTypes = (config.value || '')
            .split(',')
            .filter(Boolean)
            .map((mime: string) => {
              const found = FILE_MIME_TYPES.find((item) => item.value === mime);
              return found
                ? {
                    label: `${found.label} (${found.extension})`,
                    value: found.value,
                  }
                : { label: mime, value: mime };
            });
          acc[config.code] = selectedMimeTypes;
        } else {
          acc[config.code] = config.value;
        }
        return acc;
      }, {});

      form.reset({
        ...values,
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
