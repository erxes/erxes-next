import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const profileValidationSchema = z
  .object({
    details: z.object({
      avatar: z.any(),
      firstName: z.string(),
      lastName: z.string(),
      middleName: z.string().optional(),
      shortName: z.string().optional(),
      operatorPhone: z.string().optional(),
      birthDate: z.date().or(z.string()).optional(),
      workStartedDate: z.date().or(z.string()).optional(),
      position: z.string().optional(),
      location: z.string().optional(),
      employeeId: z.string().optional().nullable(),
    }),
    links: z
      .object({
        facebook: z
          .string()
          .url()
          .regex(/^https:\/\/(www\.)?facebook\.com\/[A-Za-z0-9._-]+$/, {
            message: 'Invalid Facebook URL',
          })
          .optional()
          .or(z.literal('')),
        twitter: z
          .string()
          .url()
          .regex(/^https:\/\/(www\.)?twitter\.com\/[A-Za-z0-9._-]+$/, {
            message: 'Invalid Twitter URL',
          })
          .optional()
          .or(z.literal('')),
        website: z
          .string()
          .url({ message: 'Invalid website URL' })
          .optional()
          .or(z.literal('')),
        discord: z
          .string()
          .url()
          .regex(/^https:\/\/(www\.)?discord\.(com|gg)\/[A-Za-z0-9]+$/, {
            message: 'Invalid Discord URL',
          })
          .optional()
          .or(z.literal('')),
        gitHub: z
          .string()
          .url()
          .regex(/^https:\/\/(www\.)?github\.com\/[A-Za-z0-9._-]+$/, {
            message: 'Invalid GitHub URL',
          })
          .optional()
          .or(z.literal('')),
        instagram: z
          .string()
          .url()
          .regex(/^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._-]+$/, {
            message: 'Invalid Instagram URL',
          })
          .optional()
          .or(z.literal('')),
      })
      .optional(),
    username: z.string(),
    email: z.string().trim().email('Email must be a valid email'),
    positionIds: z.array(z.string()).optional(),
  })
  .required();

export type FormType = z.infer<typeof profileValidationSchema>;
const useProfileForm = () => {
  const form = useForm<FormType>({
    mode: 'onBlur',
    defaultValues: {
      details: {
        avatar: '',
        firstName: '',
        lastName: '',
        shortName: '',
        middleName: '',
        operatorPhone: '',
        birthDate: undefined,
        workStartedDate: undefined,
        position: '',
        location: '',
      },
      links: {
        facebook: '',
        twitter: '',
        website: '',
        discord: '',
        gitHub: '',
        instagram: '',
      },
      username: '',
      email: '',
      employeeId: '',
      positionIds: [],
    },
    resolver: zodResolver(profileValidationSchema),
  });

  return { form };
};

export { useProfileForm };
