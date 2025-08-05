import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { PAYMENTS } from '~/modules/payment/graphql/queries';
import { IPayment, IPaymentDocument } from '~/modules/payment/types/Payment';
import { Button, Sheet } from 'erxes-ui';
import { IconCreditCard, IconPlus } from '@tabler/icons-react';
import PaymentTable from '~/modules/payment/components/PaymentTable';
import PaymentForm from '~/modules/payment/components/PaymentForm';

const PaymentModule = () => {
  const { data } = useQuery(PAYMENTS);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<(IPaymentDocument | null)> (null);
  const [payments, setPayments] = useState<(IPaymentDocument)[]>(data?.payments || []);

  const handleAddPayment = () => {
    setEditingPayment(null);
    setSheetOpen(true);
  };

  const handleEditPayment = (payment: IPaymentDocument) => {
    setEditingPayment(payment);
    setSheetOpen(true);
  };

  const handleDeletePayment = (id: string) => {
    //   if (confirm('Are you sure you want to delete this payment method?')) {
    //     setPayments(prev => prev.filter(p => p.id !== id));
    //   }
  };

  const handleSavePayment = (formData: IPayment) => {
    if (editingPayment) {
      // Update existing payment
      setPayments((prev) =>
        prev.map((p) =>
          p._id === editingPayment._id
            ? {
                ...p,
                ...formData,
                credentials: `****${Math.random().toString().slice(-4)}`,
              }
            : p,
        ),
      );
    } else {
      // Add new payment
      const newPayment = {
        id: Date.now(),
        ...formData,
        credentials: `****${Math.random().toString().slice(-4)}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setPayments((prev) => [...prev, newPayment] as IPaymentDocument[]);
    }
    setSheetOpen(false);
    setEditingPayment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <IconCreditCard className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Payment Methods
              </h1>
            </div>
            <Button onClick={handleAddPayment}>
              <IconPlus className="w-4 h-4 mr-2" />
              Add Payment
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PaymentTable
          payments={payments}
          onEdit={handleEditPayment}
          onDelete={handleDeletePayment}
        />
      </div>

      {/* Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <Sheet.View>
          <Sheet.Header>
            <Sheet.Title>
              {editingPayment ? 'Edit Payment Method' : 'Add Payment Method'}
            </Sheet.Title>
          </Sheet.Header>
          <PaymentForm
            payment={editingPayment}
            onSave={handleSavePayment}
            onCancel={() => setSheetOpen(false)}
          />
        </Sheet.View>
      </Sheet>
    </div>
  );
};

export default PaymentModule;
