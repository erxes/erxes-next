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

      form.reset({
        ...values,
      });
    }

    return;
  };

  return { form, onCompleted };
};

export { useFileUploadForm };
