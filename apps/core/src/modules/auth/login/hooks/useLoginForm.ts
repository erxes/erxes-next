import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { PASSWORD_REGEX } from 'erxes-ui';

export const validationSchema = z
  .object({
    email: z.string().trim().email('Email must be a valid email'),
    password: z
      .string()
      .regex(PASSWORD_REGEX, 'Password must contain at least 8 characters'),
  })
  .required();

export type FormType = z.infer<typeof validationSchema>;

export const useSignInUpForm = () => {
  const form = useForm<FormType>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(validationSchema),
  });

  return { form: form };
};
