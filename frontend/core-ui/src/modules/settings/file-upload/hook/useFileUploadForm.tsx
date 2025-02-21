import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { filesValidationSchema } from '@/settings/file-upload/schema';
import { UploadConfigFormT } from '@/settings/file-upload/types';
import { FILE_MIME_TYPES } from '../constants/serviceData';

const useFileUploadForm = () => {
  const form = useForm<UploadConfigFormT>({
    mode: 'onBlur',
    defaultValues: {},
    resolver: zodResolver(filesValidationSchema),
  });

  const onCompleted = (data: any) => {
    const { configs } = data || {};

    if (configs !== undefined) {
      const values = configs.reduce((acc: any, config: any) => {
        acc[config.code] = config.value;
        return acc;
      }, {});

      const uploadFileTypes = values['UPLOAD_FILE_TYPES']?.split(',');
      const uploadFileTypesArray = FILE_MIME_TYPES.filter((item) => uploadFileTypes.includes(item.value)).map(item => ({
        label: `${item.label} (${item.extension})`,
        value: item.value,
      }));

      const widgetsUploadFileTypes = values['WIDGETS_UPLOAD_FILE_TYPES']?.split(',')
      const widgetUploadFileTypesArray = FILE_MIME_TYPES.filter((item) => widgetsUploadFileTypes.includes(item.value)).map(item => ({
        label: `${item.label} (${item.extension})`,
        value: item.value,
      }));

      form.reset({
        ...values,
        UPLOAD_FILE_TYPES: uploadFileTypesArray,
        WIDGETS_UPLOAD_FILE_TYPES: widgetUploadFileTypesArray
      });
    }

    return;

  };


  return { form, onCompleted };
};

export { useFileUploadForm };
