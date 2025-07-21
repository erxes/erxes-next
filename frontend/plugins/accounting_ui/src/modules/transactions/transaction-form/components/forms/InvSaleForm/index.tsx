import { SelectAccount } from '@/settings/account/components/SelectAccount';
import { JournalEnum } from '@/settings/account/types/Account';
import { CurrencyField, fixNum, Form, Input, Select } from 'erxes-ui';
import { ITransactionGroupForm } from '../../../types/JournalForms';
import {
  AccountField,
  AssignToField,
  BranchField,
  DepartmentField,
  DescriptionField,
} from '../../GeneralFormFields';
import { CtaxForm } from '../../helpers/CtaxForm';
import { CustomerFields } from '../../helpers/CustomerFields';
import { VatForm } from '../../helpers/VatForm';
import { InventoryForm } from './InventoryForm';
import { useWatch } from 'react-hook-form';
import { useEffect } from 'react';

export const InvSaleForm = ({
  form,
  index,
}: {
  form: ITransactionGroupForm;
  index: number;
}) => {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        <AccountField
          form={form}
          index={index}
          filter={{ journals: [JournalEnum.MAIN] }}
          allDetails={true}
          labelTxt='Sale Account'
        />
        <CustomerFields form={form} index={index} />
        <BranchField form={form} index={index} />
        <DepartmentField form={form} index={index} />
        <AssignToField form={form} index={index} />
        <DescriptionField form={form} index={index} />
        <Form.Field
          control={form.control}
          name={`trDocs.${index}.invAccountId`}
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Inventory Account</Form.Label>
              <Form.Control>
                <SelectAccount
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  defaultFilter={{ journals: [JournalEnum.INVENTORY] }}
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name={`trDocs.${index}.costAccountId`}
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Cost Account</Form.Label>
              <Form.Control>
                <SelectAccount
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  defaultFilter={{ journals: [JournalEnum.MAIN] }}
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <VatForm form={form} journalIndex={index} isWithTax={false} isSameSide={true} />
        <CtaxForm form={form} journalIndex={index} isWithTax={false} isSameSide={true} />
      </div>

      <InventoryForm
        form={form}
        journalIndex={index}
      />
    </>
  );
};

