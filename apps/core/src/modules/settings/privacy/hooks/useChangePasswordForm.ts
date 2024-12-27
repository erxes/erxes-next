import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const changePasswordValidationSchema = z
  .object({
    currentPassword: z.string(),
    currentPasswordShow: z.boolean(),
    password: z.string(),
    passwordShow: z.boolean(),
    confirmPassword: z.string(),
    confirmPasswordShow: z.boolean(),
  })
  .refine(
    ({ currentPassword, password }) => {
      return currentPassword && password ? currentPassword !== password : true;
    },
    {
      message: 'New password must be different from the current password',
      path: ['password'],
    }
  )
  .refine(
    ({ password, confirmPassword }) => {
      return password && confirmPassword ? password === confirmPassword : true;
    },
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }
  );

export type FormType = z.infer<typeof changePasswordValidationSchema>;

const useChangePasswordForm = () => {
  const form = useForm<FormType>({
    mode: 'onBlur',
    defaultValues: {
      currentPassword: '',
      currentPasswordShow: false,
      password: '',
      passwordShow: false,
      confirmPassword: '',
      confirmPasswordShow: false,
    },
    resolver: zodResolver(changePasswordValidationSchema),
  });

  return { form };
};

export { useChangePasswordForm };
