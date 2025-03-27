import { useForm } from 'react-hook-form';
import { TUserForm } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '../schema/users';

const useUserForm = () => {
  const methods = useForm<TUserForm>({
    mode: 'onBlur',
    resolver: zodResolver(userSchema),
    defaultValues: {
      entries: Array.from({ length: 1 }, () => ({
        email: undefined,
        password: undefined,
        groupId: '',
        channelIds: '',
        unitId: undefined,
        branchId: undefined,
        departmentId: undefined,
      })),
    },
  });
  return {
    methods,
  };
};

export { useUserForm };
