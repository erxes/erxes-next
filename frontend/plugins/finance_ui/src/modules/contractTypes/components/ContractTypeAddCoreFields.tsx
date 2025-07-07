import { Editor, Form, Input } from 'erxes-ui';

import { Control } from 'react-hook-form';
import { ContractTypeFormValues } from '~/modules/contractTypes/components/formSchema';
import { ContractTypeHotKeyScope } from '~/modules/contractTypes/types';

export const CodeField = ({
  control,
}: {
  control: Control<ContractTypeFormValues>;
}) => {
  return (
    <Form.Field
      control={control}
      name="code"
      render={({ field }) => {
        return (
          <Form.Item>
            <Form.Label>Code</Form.Label>
            <Form.Control>
              <Input className="h-8 rounded-md" {...field} />
            </Form.Control>
            <Form.Message className="text-destructive" />
          </Form.Item>
        );
      }}
    />
  );
};

export const NameField = ({
  control,
}: {
  control: Control<ContractTypeFormValues>;
}) => {
  return (
    <Form.Field
      control={control}
      name="name"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>Name</Form.Label>
          <Form.Control>
            <Input className="h-8 rounded-md" {...field} />
          </Form.Control>
          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};

export const NumberField = ({
  control,
}: {
  control: Control<ContractTypeFormValues>;
}) => {
  return (
    <Form.Field
      control={control}
      name="number"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>Start Number</Form.Label>
          <Form.Control>
            <Input {...field} />
          </Form.Control>
          <Form.Message />
        </Form.Item>
      )}
    />
  );
};

export const VacancyField = ({
  control,
}: {
  control: Control<ContractTypeFormValues>;
}) => {
  return (
    <Form.Field
      control={control}
      name="vacancy"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>Vacancy</Form.Label>
          <Form.Control>
            <Input type="number" {...field} />
          </Form.Control>
          <Form.Message />
        </Form.Item>
      )}
    />
  );
};

export const CurrencyField = ({
  control,
}: {
  control: Control<ContractTypeFormValues>;
}) => {
  return (
    <Form.Field
      control={control}
      name="currency"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>Currency</Form.Label>
          <Form.Control>
            <Input {...field} />
          </Form.Control>
          <Form.Message />
        </Form.Item>
      )}
    />
  );
};

export const DescriptionField = ({
  control,
}: {
  control: Control<ContractTypeFormValues>;
}) => {
  return (
    <Form.Field
      control={control}
      name="description"
      render={({ field }) => (
        <Form.Item className="mb-5">
          <Form.Label>Description</Form.Label>
          <Form.Control>
            <Editor
              initialContent={field.value}
              onChange={field.onChange}
              scope={
                ContractTypeHotKeyScope.ContractTypeAddSheetDescriptionField
              }
            />
          </Form.Control>

          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};

export const InterestCalcTypeField = ({
  control,
}: {
  control: Control<ContractTypeFormValues>;
}) => {
  return (
    <Form.Field
      control={control}
      name="interestCalcType"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>Interest calc type </Form.Label>
          <Form.Control>
            <Input {...field} />
          </Form.Control>
          <Form.Message />
        </Form.Item>
      )}
    />
  );
};

export const InterestRateField = ({
  control,
}: {
  control: Control<ContractTypeFormValues>;
}) => {
  return (
    <Form.Field
      control={control}
      name="interestRate"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>Interest Rate</Form.Label>
          <Form.Control>
            <Input {...field} />
          </Form.Control>
          <Form.Message />
        </Form.Item>
      )}
    />
  );
};

export const CloseInterestRateField = ({
  control,
}: {
  control: Control<ContractTypeFormValues>;
}) => {
  return (
    <Form.Field
      control={control}
      name="closeInterestRate"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>Close Interest Rate</Form.Label>
          <Form.Control>
            <Input {...field} />
          </Form.Control>
          <Form.Message />
        </Form.Item>
      )}
    />
  );
};

export const IsAllowIncomeField = ({
  control,
}: {
  control: Control<ContractTypeFormValues>;
}) => {
  return (
    <Form.Field
      control={control}
      name="isAllowIncome"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>Is allow income</Form.Label>
          <Form.Control>
            <Input {...field} />
          </Form.Control>
          <Form.Message />
        </Form.Item>
      )}
    />
  );
};

export const ISDepositField = ({
  control,
}: {
  control: Control<ContractTypeFormValues>;
}) => {
  return (
    <Form.Field
      control={control}
      name="isDeposit"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>Is Deposit</Form.Label>
          <Form.Control>
            <Input {...field} />
          </Form.Control>
          <Form.Message />
        </Form.Item>
      )}
    />
  );
};

export const LimitPercentageField = ({
  control,
}: {
  control: Control<ContractTypeFormValues>;
}) => {
  return (
    <Form.Field
      control={control}
      name="limitPercentage"
      render={({ field }) => (
        <Form.Item>
          <Form.Label>limit Percentage</Form.Label>
          <Form.Control>
            <Input {...field} />
          </Form.Control>
          <Form.Message />
        </Form.Item>
      )}
    />
  );
};
