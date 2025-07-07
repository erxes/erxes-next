import { UseFormReturn } from 'react-hook-form';
import {
  CodeField,
  CloseInterestRateField,
  CurrencyField,
  DescriptionField,
  InterestCalcTypeField,
  InterestRateField,
  IsAllowIncomeField,
  ISDepositField,
  LimitPercentageField,
  NameField,
  NumberField,
  VacancyField,
} from '~/modules/contractTypes/components/ContractTypeAddCoreFields';

import { ContractTypeFormValues } from '~/modules/contractTypes/components/formSchema';

export const ContractTypeGeneralInformationFields = ({
  form,
}: {
  form: UseFormReturn<ContractTypeFormValues>;
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 py-4">
        <CodeField control={form.control} />
        <NameField control={form.control} />
        <NumberField control={form.control} />
        <VacancyField control={form.control} />
        <CurrencyField control={form.control} />
        <InterestCalcTypeField control={form.control} />
        <InterestRateField control={form.control} />
        <CloseInterestRateField control={form.control} />
        <IsAllowIncomeField control={form.control} />
        <ISDepositField control={form.control} />
        <LimitPercentageField control={form.control} />
      </div>
      <DescriptionField control={form.control} />
    </>
  );
};
