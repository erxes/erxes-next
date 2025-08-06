import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { PAYMENTS } from '~/modules/payment/graphql/queries';
import {
  ADD_PAYMENT,
  EDIT_PAYMENT,
  REMOVE_PAYMENT,
} from '~/modules/payment/graphql/mutations';
import { IPayment, IPaymentDocument } from '~/modules/payment/types/Payment';
import { Button, Sheet, useConfirm, useToast, Breadcrumb } from 'erxes-ui';
import { IconArrowBack, IconCreditCard, IconPlus } from '@tabler/icons-react';
import PaymentTable from '~/modules/payment/components/PaymentTable';
import PaymentForm from '~/modules/payment/components/PaymentForm';
import { Link } from 'react-router-dom';
import { PageHeader } from 'ui-modules';

const PaymentModule = () => {
  const { data } = useQuery(PAYMENTS);
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const confirmOptions = { confirmationValue: 'delete' };
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<IPaymentDocument | null>(
    null,
  );
  const [payments, setPayments] = useState<IPaymentDocument[]>(
    data?.payments || [],
  );

  const [addPayment] = useMutation(ADD_PAYMENT);
  const [editPayment] = useMutation(EDIT_PAYMENT);
  const [removePayment] = useMutation(REMOVE_PAYMENT);

  const handleAddPayment = () => {
    setEditingPayment(null);
    setSheetOpen(true);
  };

  const handleEditPayment = (payment: IPaymentDocument) => {
    setEditingPayment(payment);
    setSheetOpen(true);
  };

  const handleDeletePayment = (id: string) => {
    confirm({
      message: 'Are you sure you want to delete this payment method?',
      options: confirmOptions,
    }).then(async () => {
      removePayment({
        variables: {
          _id: id,
        },
      })
        .then(() => {
          toast({
            title: 'Success',
            description: 'Payment method deleted successfully',
          });
          setPayments((prev) => prev.filter((p) => p._id !== id));
        })
        .catch((e) => {
          toast({
            title: 'Error',
            description: e.message,
          });
        });
    });
  };

  const handleSavePayment = (formData: IPayment) => {
    if (editingPayment) {
      // Update existing payment
      editPayment({
        variables: {
          _id: editingPayment._id,
          input: formData,
        },
      })
        .then(() => {
          toast({
            title: 'Success',
            description: 'Payment method updated successfully',
          });
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
        })
        .catch((e) => {
          toast({
            title: 'Error',
            description: e.message,
          });
        });
    } else {
      // Add new payment
      addPayment({
        variables: {
          input: formData,
        },
      })
        .then(() => {
          toast({
            title: 'Success',
            description: 'Payment method added successfully',
          });
          const newPayment = {
            ...formData,
            credentials: `****${Math.random().toString().slice(-4)}`,
            createdAt: new Date().toISOString().split('T')[0],
          };
          setPayments((prev) => [...prev, newPayment] as IPaymentDocument[]);
        })
        .catch((e) => {
          toast({
            title: 'Error',
            description: e.message,
          });
        });
    }
    setSheetOpen(false);
    setEditingPayment(null);
  };

  useEffect(() => {
    if (data) {
      setPayments(data.payments);
    }
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/payment">
                    <IconArrowBack />
                    Invoices
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
        </PageHeader.Start>
      </PageHeader>

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
          <Sheet.Content>
            <PaymentForm
              payment={editingPayment}
              onSave={handleSavePayment}
              onCancel={() => setSheetOpen(false)}
            />
          </Sheet.Content>
        </Sheet.View>
      </Sheet>
    </div>
  );
};

export default PaymentModule;
