import React from 'react';
import { IPaymentDocument } from '~/modules/payment/types/Payment';
import { Checkbox, Input, Label } from 'erxes-ui';
import zod from 'zod';

type Props = { payment?: IPaymentDocument };

type State = {
  paymentName: string;
  type: 'company' | 'person' | undefined;
  registerNumber: string;
  name: string;

  mccCode: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  email: string;

  companyName: string;
  lastName: string;
  firstName: string;
  businessName: string;
  bankCode: string;
  bankAccount: string;
  ibanNumber: string;
  bankAccountName: string;
  isFlat: boolean;
  merchantId: string;
};

const schema = zod.object({
  paymentName: zod.string().min(1),
  type: zod.enum(['company', 'person']),
  registerNumber: zod.string().min(1),
  name: zod.string().min(1),
  mccCode: zod.string().min(1),
  city: zod.string().min(1),
  district: zod.string().min(1),
  address: zod.string().min(1),
  phone: zod.string().min(1),
  email: zod.string().email(),
  companyName: zod.string().min(1),
  lastName: zod.string().min(1),
  firstName: zod.string().min(1),
  businessName: zod.string().min(1),
  bankCode: zod.string().min(1),
  bankAccount: zod.string().min(1),
  ibanNumber: zod.string().min(1),
  bankAccountName: zod.string().min(1),
  isFlat: zod.boolean(),
  merchantId: zod.string().min(1),
});

const QuickQrForm = (props: Props) => {
  const { payment } = props;
  const config = payment?.config;
  const name = payment?.name;
  const [state, setState] = React.useState<State>({
    type: config ? (config.isCompany ? 'company' : 'person') : undefined,
    ...config,
    name,
    companyName: config?.companyName,
    business_name: config?.businessName,
  });

  const renderInput = (
    key: string,
    title: string,
    description?: string,
    isPassword?: boolean,
  ) => {
    if (key === 'isFlat') {
      return (
        <>
          <Label>{title}</Label>
          {/* <Checkbox
                    checked={state[key as keyof State] || false}
                    onCheckedChange={(e) => setState({ ...state, [key]: e.target.value })}
                /> */}
        </>
      );
    }
    const stateValue = state[key as keyof State];
    const value =
      typeof stateValue === 'boolean'
        ? stateValue.toString()
        : (stateValue as string) || '';

    return (
      <>
        <Label>{title}</Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        <Input
          name={key}
          value={value}
          onChange={(e) => setState({ ...state, [key]: e.target.value })}
          placeholder={title}
          type={isPassword ? 'password' : 'text'}
          required
        />
      </>
    );
  };

  return (
    <div>
      {renderInput('paymentName', 'Payment name')}
      {renderInput('type', 'Type')}
      {renderInput('registerNumber', 'Register number')}
      {renderInput('name', 'Name')}
      {renderInput('mccCode', 'MCC code')}
      {renderInput('city', 'City')}
      {renderInput('district', 'District')}
      {renderInput('address', 'Address')}
      {renderInput('phone', 'Phone')}
      {renderInput('email', 'Email')}
      {renderInput('companyName', 'Company name')}
      {renderInput('lastName', 'Last name')}
      {renderInput('firstName', 'First name')}
      {renderInput('businessName', 'Business name')}
      {renderInput('bankCode', 'Bank code')}
      {renderInput('bankAccount', 'Bank account')}
      {renderInput('ibanNumber', 'IBAN number')}
      {renderInput('bankAccountName', 'Bank account name')}
      {renderInput('isFlat', 'Is flat')}
      {renderInput('merchantId', 'Merchant ID')}
    </div>
  );
};

export default QuickQrForm;
