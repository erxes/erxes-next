import { useForm } from 'react-hook-form';
import { TUserForm } from '@/settings/team-member/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { USER_SCHEMA } from '@/settings/team-member/schema/users';

const useUserForm = () => {
  const methods = useForm<TUserForm>({
    mode: 'onBlur',
    resolver: zodResolver(USER_SCHEMA),
    defaultValues: {
      entries: Array.from({ length: 1 }, () => ({
        email: undefined,
        password: undefined,
        groupId: '',
        channelIds: undefined,
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
