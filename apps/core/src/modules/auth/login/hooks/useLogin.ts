import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { FormType } from '@/auth/login/hooks/useLoginForm';
import { useCallback } from 'react';
import { useAuth } from '@/auth/hooks/useAuth';

export const useLogin = (form: UseFormReturn<FormType>) => {
  const { handleCrendentialsLogin } = useAuth();

  const submitCertencial: SubmitHandler<FormType> = useCallback(
    async (data) => {
      handleCrendentialsLogin(data.email, data.password);
    },
    [handleCrendentialsLogin]
  );

  return {
    submitCertencial,
  };
};
