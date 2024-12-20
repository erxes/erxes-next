import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const profileValidationSchema = z
  .object({
    details: z.object({
      avatar: z.any(),
      firstName: z.string(),
      lastName: z.string(),
      middleName: z.string(),
      shortName: z.string(),
      operatorPhone: z.string(),
      birthDate: z.date().or(z.string()),
      workStartedDate: z.date().or(z.string()),
      position: z.string(),
      location: z.string(),
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
    employeeId: z.string(),
    positionIds: z.array(z.string()),
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

  const onCompleted = (data) => {
    const { username, employeeId, positionIds, email, details, links } =
      data.userDetail || {};

    form.setValue('username', username);
    form.setValue('employeeId', employeeId);
    form.setValue('positionIds', positionIds);
    form.setValue('email', email);
    form.setValue('details', details);
    form.setValue('links', links);
  };

  return { form, onCompleted };
};

export { useProfileForm };
