import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { number, z } from 'zod';

export const contractTypeValidationSchema = z.object({
  name: z.string(),
  code: z.string(),
  startNumber: z.string(),
  vacancy: z.number(),
  currency: z.string().optional(),
  decsription: z.string().optional(),
  interestCalcType: z.string().optional(),
  isAllowIncome: z.string().optional(),
  isDeposit: z.string().optional(),
  limitPercentage: z.string().optional(),
});

export type FormType = z.infer<typeof contractTypeValidationSchema>;
const useContractTypeForm = () => {
  const form = useForm<FormType>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      code: '',
      startNumber: '',
      vacancy: 1,
      currency: '',
      decsription: '',
      interestCalcType: '',
      isAllowIncome: '',
      isDeposit: '',
      limitPercentage: '',
    },
    resolver: zodResolver(contractTypeValidationSchema),
  });
  return { form };
};

export { useContractTypeForm };
