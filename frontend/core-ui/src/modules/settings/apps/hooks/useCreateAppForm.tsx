import { CREATE_TOKEN_SCHEMA } from '@/settings/apps/schema';
import { TCreateAppForm } from '@/settings/apps/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export const useCreateAppForm = () => {
  const form = useForm<TCreateAppForm>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      noExpire: false,
      allowAllPermission: false,
      expireDate: new Date(),
      userGroupId: '',
    },
    resolver: zodResolver(CREATE_TOKEN_SCHEMA),
  });
  return {
    methods: form,
  };
};
