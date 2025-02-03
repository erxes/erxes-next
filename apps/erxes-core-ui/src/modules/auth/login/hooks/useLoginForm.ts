import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { PASSWORD_REGEX } from 'erxes-ui/utils';

export const authValidationSchema = z
  .object({
    email: z.string().trim().email('Email must be a valid email'),
    password: z
      .string()
      .regex(PASSWORD_REGEX, 'Password must contain at least 8 characters'),
  })
  .required();

export type FormType = z.infer<typeof authValidationSchema>;

export const useSignInUpForm = () => {
  const form = useForm<FormType>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(authValidationSchema),
  });

  return { form };
};

export const resedPasswordValidationSchema = z
  .object({
    password: authValidationSchema.shape.password,
    confirmPassword: authValidationSchema.shape.password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ResetPasswordFormType = z.infer<
  typeof resedPasswordValidationSchema
>;

export const useResetPasswordForm = () => {
  const form = useForm<ResetPasswordFormType>({
    mode: 'onBlur',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(resedPasswordValidationSchema),
  });
  return { form };
};
