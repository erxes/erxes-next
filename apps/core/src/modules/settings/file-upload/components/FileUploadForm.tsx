import React from 'react'
import { IconLoader2 } from '@tabler/icons-react';
import {
  Label,
  Button,
  Form,
} from 'erxes-ui/components';
import { useMemo } from 'react';
import { motion } from 'motion/react';
import UploadServiceRadioGroup from '@/settings/file-upload/components/UploadServiceRadioGroup';
import DynamicServiceConfigFields from '@/settings/file-upload/components/DynamicServiceConfigFields';
import { UploadConfigFormT } from '@/settings/file-upload/types';
import { serviceFields } from '@/settings/file-upload/constants/uploadServiceFields';
import { useConfig } from '@/settings/file-upload/hook/useConfigs';
import { useFileUploadForm } from '@/settings/file-upload/hook/useFileUploadForm';
import FileUploadMainFields from '@/settings/file-upload/components/FileUploadMainFields';
import { FILE_MIME_TYPES } from '@/settings/file-upload/constants/serviceData';

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

const FileUploadForm = () => {
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

  function transformSpecificFields(formData) {
    const transformedData = { ...formData };

    ['UPLOAD_FILE_TYPES', 'WIDGETS_UPLOAD_FILE_TYPES'].forEach(key => {
      if (Array.isArray(formData[key])) {
        transformedData[key] = formData[key].map(type => type.value);
      }
    });

    return transformedData;
  }

  const onSubmit = (data: UploadConfigFormT) => {
    const newData = transformSpecificFields(data)
    console.log(data, 'onSubmit', newData);
    updateConfig(newData);
  };

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

        <div className="grid grid-cols-8 py-4 col-start-3 gap-2 w-full">
          {/* <motion.div
                  whileTap={{ scale: 0.975 }}
                  className="w-full col-start-3"
                >
                  <Button
                    type="reset"
                    variant={'destructive'}
                    size={'sm'}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </motion.div> */}
          <motion.div whileTap={{ scale: 0.975 }} className="w-full col-start-8">
            <Button
              type="submit"
              disabled={isLoading}
              size={'sm'}
              className="w-full"
            >
              {(isLoading && <IconLoader2 className="animate-spin" />) ||
                'Update'}
            </Button>
          </motion.div>
        </div>
      </form>
    </Form>
  )
}

export default FileUploadForm
