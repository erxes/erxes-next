import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { FIELS_VALIDATION_SCHEMA } from '@/settings/file-upload/schema';
import { UploadConfigFormT } from '@/settings/file-upload/types';
import { FILE_MIME_TYPES } from '../constants/serviceData';

const useFileUploadForm = () => {
  const form = useForm<UploadConfigFormT>({
    mode: 'onBlur',
    defaultValues: {},
    resolver: zodResolver(FIELS_VALIDATION_SCHEMA),
  });

  return { form };
};

export { useFileUploadForm };
