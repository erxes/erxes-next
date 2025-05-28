import { ICommonFieldProps } from '../types/AddTransaction';
import { CurrencyField, Form, Input, Select } from 'erxes-ui';
import { SelectAccount } from '@/settings/account/components/SelectAccount';
import {
  AssignMultipleMembers,
  SelectBranch,
  SelectDepartment,
} from 'ui-modules';
import { TR_JOURNAL_LABELS, TrJournalEnum } from '../../types/constants';
import { IAccount } from '~/modules/settings/account/types/Account';

export const AccountField = ({
  form,
  index,
  journal,
}: ICommonFieldProps & {
  journal: TrJournalEnum;
}) => {
  const onChangeAccount = (account: IAccount) => {
    form.setValue(`trDocs.${index}.details.0.account`, account as any);
  }
  return (
    <Form.Field
      control={form.control}
      name={`trDocs.${index}.details.0.accountId`}
      render={({ field }) => (
        <Form.Item>
          <Form.Label>{TR_JOURNAL_LABELS[journal]} account</Form.Label>
          <Form.Control>
            <SelectAccount
              value={field.value || ''}
              onValueChange={field.onChange}
              onCallback={onChangeAccount}
              defaultFilter={{ journals: [journal] }}
            />
          </Form.Control>
          <Form.Message />
        </Form.Item>
      )}
    />
  )
};

export const SideField = ({
  form,
  index,
  sides,
}: ICommonFieldProps & {
  sides: {
    label: string;
    value: string;
  }[];
}) => (
  <Form.Field
    control={form.control}
    name={`trDocs.${index}.details.0.side`}
    render={({ field }) => (
      <Form.Item>
        <Form.Label>Side</Form.Label>
        <Select value={field.value} onValueChange={field.onChange}>
          <Form.Control>
            <Select.Trigger className="h-8">
              <Select.Value />
            </Select.Trigger>
          </Form.Control>
          <Select.Content>
            {sides.map((side) => (
              <Select.Item key={side.value} value={side.value}>
                {side.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </Form.Item>
    )}
  />
);

export const AmountField = ({ form, index }: ICommonFieldProps) => (
  <Form.Field
    control={form.control}
    name={`trDocs.${index}.details.0.amount`}
    render={({ field }) => (
      <Form.Item>
        <Form.Label>Amount</Form.Label>
        <Form.Control>
          <CurrencyField.ValueInput value={field.value} onChange={field.onChange} />
        </Form.Control>
      </Form.Item>
    )}
  />
);

export const AssignToField = ({ form, index }: ICommonFieldProps) => (
  <Form.Field
    control={form.control}
    name={`trDocs.${index}.assignedUserIds`}
    render={({ field }) => (
      <Form.Item>
        <Form.Label>Assign To</Form.Label>
        <Form.Control>
          <AssignMultipleMembers
            onValueChange={(user) => field.onChange(user)}
            value={field.value}
          />
        </Form.Control>
        <Form.Message />
      </Form.Item>
    )}
  />
);

export const BranchField = ({ form, index }: ICommonFieldProps) => (
  <Form.Field
    control={form.control}
    name={`trDocs.${index}.branchId`}
    render={({ field }) => (
      <Form.Item>
        <Form.Label>Branch</Form.Label>
        <Form.Control>
          <SelectBranch
            value={field.value ?? ''}
            onValueChange={(branch) => field.onChange(branch)}
          />
        </Form.Control>
        <Form.Message />
      </Form.Item>
    )}
  />
);

export const DepartmentField = ({ form, index }: ICommonFieldProps) => (
  <Form.Field
    control={form.control}
    name={`trDocs.${index}.departmentId`}
    render={({ field }) => (
      <Form.Item>
        <Form.Label>Department</Form.Label>
        <Form.Control>
          <SelectDepartment
            value={field.value ?? ''}
            onValueChange={(department) => field.onChange(department)}
          />
        </Form.Control>
        <Form.Message />
      </Form.Item>
    )}
  />
);

export const DescriptionField = ({ form, index }: ICommonFieldProps) => (
  <Form.Field
    control={form.control}
    name={`trDocs.${index}.description`}
    render={({ field }) => (
      <Form.Item>
        <Form.Label>Description</Form.Label>
        <Form.Control>
          <Input {...field} value={field.value ?? ''} />
        </Form.Control>
        <Form.Message />
      </Form.Item>
    )}
  />
);
