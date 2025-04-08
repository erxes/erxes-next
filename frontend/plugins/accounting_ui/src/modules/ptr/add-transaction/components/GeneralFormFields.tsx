import { ICommonFieldProps, JournalType } from '../types/AddTransaction';
import { CurrencyValueInput, Form, Input, Select, Textarea } from 'erxes-ui';
import { SelectAccount } from '@/account/components/SelectAccount';
import { JOURNAL_LABELS } from '../contants/journalLabel';
import {
  AssignMultipleMembers,
  SelectBranch,
  SelectDepartment,
} from 'ui-modules';

export const AccountField = ({
  form,
  index,
  journal,
}: ICommonFieldProps & {
  journal: JournalType;
}) => (
  <Form.Field
    control={form.control}
    name={`details.${index}.accountId`}
    render={({ field }) => (
      <Form.Item>
        <Form.Label>{JOURNAL_LABELS[journal]} account</Form.Label>
        <Form.Control>
          <SelectAccount
            value={field.value}
            onChange={field.onChange}
            journal={journal}
          />
        </Form.Control>
      </Form.Item>
    )}
  />
);

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
    name={`details.${index}.side`}
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
    name={`details.${index}.amount`}
    render={({ field }) => (
      <Form.Item>
        <Form.Label>Amount</Form.Label>
        <Form.Control>
          <CurrencyValueInput value={field.value} onChange={field.onChange} />
        </Form.Control>
      </Form.Item>
    )}
  />
);

export const AssignToField = ({ form, index }: ICommonFieldProps) => (
  <Form.Field
    control={form.control}
    name={`details.${index}.assignedUserIds`}
    render={({ field }) => (
      <Form.Item>
        <Form.Label>Assign To</Form.Label>
        <Form.Control>
          <AssignMultipleMembers
            onValueChange={(user) => field.onChange(user)}
            value={field.value}
          />
        </Form.Control>
      </Form.Item>
    )}
  />
);

export const BranchField = ({ form, index }: ICommonFieldProps) => (
  <Form.Field
    control={form.control}
    name={`details.${index}.branchId`}
    render={({ field }) => (
      <Form.Item>
        <Form.Label>Branch</Form.Label>
        <Form.Control>
          <SelectBranch
            value={field.value}
            onValueChange={(branch) => field.onChange(branch)}
          />
        </Form.Control>
      </Form.Item>
    )}
  />
);

export const DepartmentField = ({ form, index }: ICommonFieldProps) => (
  <Form.Field
    control={form.control}
    name={`details.${index}.departmentId`}
    render={({ field }) => (
      <Form.Item>
        <Form.Label>Department</Form.Label>
        <Form.Control>
          <SelectDepartment
            value={field.value}
            onValueChange={(department) => field.onChange(department)}
          />
        </Form.Control>
      </Form.Item>
    )}
  />
);

export const DescriptionField = ({ form, index }: ICommonFieldProps) => (
  <Form.Field
    control={form.control}
    name={`details.${index}.description`}
    render={({ field }) => (
      <Form.Item>
        <Form.Label>Description</Form.Label>
        <Form.Control>
          <Input {...field} />
        </Form.Control>
      </Form.Item>
    )}
  />
);
