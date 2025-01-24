import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { filesValidationSchema } from '@/settings/file-upload/schema';
import { UploadConfigFormT } from '@/settings/file-upload/types';
import { FILE_MIME_TYPES } from '../constants/serviceData';

type Option = {
  label: string;
  value: string;
};

const useFileUploadForm = () => {

  const modifiedArray: Option[] = FILE_MIME_TYPES.map(
    ({ label, extension, value }) => ({
      label: `${label} (${extension})`,
      value: value,
    })
  );

  const form = useForm<UploadConfigFormT>({
    mode: "onBlur",
    resolver: zodResolver(filesValidationSchema),
  });

  const onCompleted = (data) => {
    const { configs } = data && data || [];
    
    configs?.map((config) => {
      if(config.code === "WIDGETS_UPLOAD_FILE_TYPES" || config.code === "UPLOAD_FILE_TYPES"){
        const value = config.value?.map(data => {
          return {
            label: modifiedArray.find(item => item.value === data)?.label,
            value: data
          }
        })
        form.setValue(config.code, value)
      }
      else form.setValue(config.code, config.value)
    })
  }

  return { form, onCompleted }
}

export {
  useFileUploadForm,
}