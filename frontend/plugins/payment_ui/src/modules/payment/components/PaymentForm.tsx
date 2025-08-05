import { useState, useMemo } from 'react';
import { Button, Input, Select } from 'erxes-ui';
import { PAYMENT_KINDS } from '~/modules/payment/constants';
import { paymentKind } from '~/modules/payment/utils';
import { Form } from 'erxes-ui/components/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { z } from 'zod';

type Props = {
    payment: any;
    onSave: (payment: any) => void;
    onCancel: () => void;
}

// Base validation schema
const baseSchema = z.object({
  kind: z.string().min(1, 'Payment method is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
});

// Dynamic schema generator based on payment kind
const createPaymentSchema = (selectedKind: string) => {
  if (!selectedKind) {
    return baseSchema;
  }

  const payment = paymentKind(selectedKind);
  if (!payment?.fields) {
    return baseSchema;
  }

  // Create dynamic fields schema
  const dynamicFields: Record<string, z.ZodType> = {};
  
  payment.fields.forEach(field => {
    let fieldSchema: z.ZodType;
    
    switch (field.type) {
      case 'email':
        fieldSchema = z.string().email(`Invalid ${field.label.toLowerCase()}`);
        break;
      case 'url':
        fieldSchema = z.string().url(`Invalid ${field.label.toLowerCase()} URL`);
        break;
      case 'number':
        fieldSchema = z.string().regex(/^\d+$/, `${field.label} must be a valid number`);
        break;
      case 'password':
        fieldSchema = z.string().min(8, `${field.label} must be at least 8 characters`);
        break;
      default:
        fieldSchema = z.string().min(1, `${field.label} is required`);
    }

    // Apply optional/required based on field configuration
  
      dynamicFields[field.key] = fieldSchema;


    // Add custom validation if specified
    if (field.validation) {
      switch (field.validation.type) {
        case 'minLength':
          dynamicFields[field.key] = (dynamicFields[field.key] as z.ZodString)
            .min(field.validation.value, `${field.label} must be at least ${field.validation.value} characters`);
          break;
        case 'maxLength':
          dynamicFields[field.key] = (dynamicFields[field.key] as z.ZodString)
            .max(field.validation.value, `${field.label} must be less than ${field.validation.value} characters`);
          break;
      }
    }
  });

  return baseSchema.extend(dynamicFields);
};

const PaymentForm = ({ payment, onSave, onCancel }: Props) => {
  const [selectedKind, setSelectedKind] = useState(payment?.kind || '');

  // Create dynamic schema based on selected payment kind
  const validationSchema = useMemo(() => 
    createPaymentSchema(selectedKind), 
    [selectedKind]
  );

  // Initialize form with react-hook-form and zod resolver
  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      kind: payment?.kind || '',
      name: payment?.name || '',
      ...Object.fromEntries(
        (payment?.kind ? paymentKind(payment.kind)?.fields ?? [] : []).map(
          field => [field.key, payment?.[field.key] || '']
        )
      )
    },
    mode: 'onBlur', // Validate on blur for better UX
  });

  const { handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = form;

  // Watch for kind changes to update schema
  const watchedKind = watch('kind');
  
  React.useEffect(() => {
    if (watchedKind !== selectedKind) {
      setSelectedKind(watchedKind);
      
      // Clear previous payment-specific fields when kind changes
      if (selectedKind) {
        const prevPayment = paymentKind(selectedKind);
        prevPayment?.fields.forEach(field => {
          setValue(field.key as any, '');
        });
      }
    }
  }, [watchedKind, selectedKind, setValue]);

  const onSubmit = (data: any) => {
    // Additional custom validation if needed
    try {
      onSave(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const currentPaymentKind = paymentKind(selectedKind);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Payment Kind Selection */}
      <Form.Field 
        name="kind" 
        control={form.control} 
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Payment Method *</Form.Label>
            <Form.Control>
              <Select
                {...field}
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedKind(value);
                }}
              >
                <option value="">Select payment method</option>
                {Object.entries(PAYMENT_KINDS).map(([key, method]) => (
                  <option key={key} value={key}>
                    {method.name}
                  </option>
                ))}
              </Select>
            </Form.Control>
        
          </Form.Item>
        )}
      />

      {/* Display Name */}
      <Form.Field 
        name="name" 
        control={form.control} 
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Display Name *</Form.Label>
            <Form.Control>
              <Input
                {...field}
                placeholder="Enter a name for this payment method"
              />
            </Form.Control>
       
          </Form.Item>
        )}
      />

      {/* Dynamic Payment-Specific Fields */}
      {currentPaymentKind?.fields.map(fieldConfig => (
        <Form.Field 
          key={fieldConfig.key}
          name={fieldConfig.key as any} 
          control={form.control} 
          render={({ field }) => (
            <Form.Item>
              <Form.Label>
                {fieldConfig.label} *
            
              </Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  type={fieldConfig.type || 'text'}
                  placeholder={`Enter ${fieldConfig.label.toLowerCase()}`}
                  autoComplete={fieldConfig.type === 'password' ? 'new-password' : 'off'}
                />
              </Form.Control>
            
            </Form.Item>
          )}
        />
      ))}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t">
        <Button 
          type="submit" 
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (payment ? 'Update' : 'Save')} Payment Method
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;