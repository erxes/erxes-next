import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { TTeamForm } from '@/team/types';
import { TEAM_FORM_SCHEMA } from '@/team/schemas';

export const useTeamForm = () => {
  const methods = useForm<TTeamForm>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      description: '',
    },
    resolver: zodResolver(TEAM_FORM_SCHEMA),
  });
  return {
    methods,
  };
};
