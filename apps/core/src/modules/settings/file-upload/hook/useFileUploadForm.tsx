import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { filesValidationSchema } from '../schema';
import { UploadConfigFormT } from '../types';

const useFileUploadForm = () => {

  const form = useForm<UploadConfigFormT>({
    mode: "onBlur",
    defaultValues: {},
    resolver: zodResolver(filesValidationSchema),
  });

  const onCompleted = (data) => {
    console.log(data, 'data on complete')

    const { configs } = data && data || [];

    configs?.map((config) => form.setValue(config.code, config.value))
  }

  return { form, onCompleted }
}

export {
  useFileUploadForm,
}