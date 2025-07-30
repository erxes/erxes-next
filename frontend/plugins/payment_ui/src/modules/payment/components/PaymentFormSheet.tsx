import { IconPlus, IconEdit } from '@tabler/icons-react';
import { Button, ScrollArea, Sheet, Form, Input, Select, Alert } from 'erxes-ui';
import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_PAYMENT, EDIT_PAYMENT } from '../graphql/mutations';
import { PAYMENTS } from '../graphql/queries';
import { IPayment } from '../types/Payment';


import ConfigForm from '~/modules/payment/components/ConfigForm';
import KhanBankForm from '~/modules/payment/components/KhanBankForm';
import QuickQrForm from '~/modules/payment/components/QuickQrForm';
import { PAYMENT_KINDS } from '~/modules/payment/constants';
import type { PaymentKind } from '~/modules/payment/types/PaymentMethods';

type Props = {
  show: boolean;
  payment?: IPayment | null;
  onClose: () => void;
  kind: string;
  trigger?: React.ReactNode;
};

interface AlertState {
  type: 'success' | 'error' | null;
  message: string;
  description?: string;
}

const PaymentFormSheet: React.FC<Props> = ({ show, payment, onClose, kind, trigger }) => {
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [formData, setFormData] = useState<Omit<IPayment, '_id' | 'createdAt'>>({
    name: '',
    kind: 'custom',
    status: 'active',
    config: {},
  });

  const [addPayment] = useMutation<{ paymentAdd: IPayment }, { input: Omit<IPayment, '_id' | 'createdAt'> }>(ADD_PAYMENT, {
    update(cache, { data: { paymentAdd } }) {
      const { payments } = cache.readQuery({ query: PAYMENTS }) || { payments: [] };
      cache.writeQuery({
        query: PAYMENTS,
        data: { payments: [...payments, paymentAdd] },
      });
    },
    optimisticResponse: (variables) => ({
      paymentAdd: {
        __typename: 'Payment',
        _id: `optimistic-${Date.now()}`,
        ...variables.input,
        createdAt: new Date().toISOString(),
      },
    }),
  });

  const [editPayment] = useMutation<{ paymentEdit: IPayment }, { _id: string; input: Omit<IPayment, '_id' | 'createdAt'> }>(EDIT_PAYMENT, {
    update(cache, { data: { paymentEdit } }) {
      const { payments } = cache.readQuery({ query: PAYMENTS }) || { payments: [] };
      cache.writeQuery({
        query: PAYMENTS,
        data: {
          payments: payments.map((p: IPayment) =>
            p._id === paymentEdit._id ? paymentEdit : p
          ),
        },
      });
    },
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        name: payment.name,
        kind: payment.kind,
        status: payment.status,
        config: payment.config || {},
      });
    } else {
      setFormData({
        name: '',
        kind: 'custom',
        status: 'active',
        config: {},
      });
    }
  }, [payment]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const input = {
        name: formData.name || '',
        kind: formData.kind || 'custom',
        status: formData.status || 'active',
        config: formData.config || {},
      };

      if (payment?._id) {
        await editPayment({
          variables: {
            _id: payment._id,
            input,
          },
        });
        setAlert({
          type: 'success',
          message: 'Payment updated successfully'
        });
      } else {
        await addPayment({
          variables: { input },
          optimisticResponse: {
            paymentAdd: {
              __typename: 'Payment',
              _id: `optimistic-${Date.now()}`,
              ...input,
              createdAt: new Date().toISOString(),
            },
          },
        });
        setAlert({
          type: 'success',
          message: 'Payment added successfully'
        });
      }
      onClose();
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Error',
        description: error.message
      });
    }
  };

  const renderContent = () => {
    switch (kind as PaymentKind) {
      case 'quickqr':
        return <QuickQrForm />;
      case 'khanbank':
        return <KhanBankForm />;
      default:
        return <ConfigForm inputs={PAYMENT_KINDS[kind as PaymentKind]?.inputs || []} />;
    }
  };

  return (
    <Sheet open={show} onOpenChange={onClose}>
      <Sheet.Trigger asChild>
        {trigger || (
          <Button className="max-w-fit">
            {payment ? <IconEdit /> : <IconPlus />}
            {payment ? 'Edit' : 'Add'} {PAYMENT_KINDS[kind as keyof typeof PAYMENT_KINDS].name}
          </Button>
        )}
      </Sheet.Trigger>
      <ScrollArea>
        <Sheet.View className="p-4">
          <Sheet.Header>
            <Sheet.Title>
              {payment ? 'Edit Payment' : 'Add New Payment'}
            </Sheet.Title>
            <Sheet.Close />
          </Sheet.Header>

          <Form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Select
                  name="kind"
                  value={formData.kind}
                  onChange={handleInputChange}
                  options={Object.entries(PAYMENT_KINDS).map(([value, { name }]) => ({
                    value,
                    label: name,
                  }))}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'archived', label: 'Archived' },
                  ]}
                  required
                />
              </Form.Group>

              {renderContent()}
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {payment ? 'Update' : 'Add'} Payment
              </Button>
            </div>
          </Form>
        </Sheet.View>
      </ScrollArea>
      
      {alert && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert className={alert.type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'}>
            {alert.type === 'error' ? (
              <Alert.Title>{alert.message}</Alert.Title>
            ) : (
              <Alert.Title>{alert.message}</Alert.Title>
            )}
            {alert.description && (
              <Alert.Description>{alert.description}</Alert.Description>
            )}
          </Alert>
        </div>
      )}
    </Sheet>
  );
};

export default PaymentFormSheet;
