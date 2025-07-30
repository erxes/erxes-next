import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { PAYMENTS } from '../graphql/queries';
import { REMOVE_PAYMENT } from '../graphql/mutations';
import { Button } from 'erxes-ui';
import { IPayment } from '../types/Payment';
import PaymentFormSheet from './PaymentFormSheet';

interface PaymentListProps {
  // Add any props if needed
}

type Payment = IPayment & {
  _id: string;
  createdAt?: string;
};

interface PaymentsData {
  payments: Payment[];
}

const PaymentList: React.FC<PaymentListProps> = () => {
  const { data, loading, error } = useQuery<PaymentsData>(PAYMENTS);
  const [showForm, setShowForm] = React.useState(false);
  const [currentPayment, setCurrentPayment] = React.useState<Payment | null>(null);
  
  const [removePayment] = useMutation<{ paymentRemove: { _id: string } }, { _id: string }>(REMOVE_PAYMENT, {
    update(cache, { data }) {
      if (!data?.paymentRemove) return;
      
      const cachedData = cache.readQuery<PaymentsData>({ query: PAYMENTS });
      if (!cachedData?.payments) return;
      
      cache.writeQuery<PaymentsData>({
        query: PAYMENTS,
        data: { 
          payments: cachedData.payments.filter(
            (p: Payment) => p._id !== data.paymentRemove._id
          ) 
        },
      });
    },
    onError: (error) => {
      console.error('Error removing payment:', error);
      // Use window.alert as a fallback if Alert is not available
      window.alert(`Error removing payment: ${error.message}`);
    },
  });

  const handleAddClick = () => {
    setCurrentPayment(null);
    setShowForm(true);
  };

  const handleEditClick = (payment: Payment) => {
    setCurrentPayment(payment);
    setShowForm(true);
  };

  const handleRemove = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await removePayment({
          variables: { _id: id },
          optimisticResponse: {
            paymentRemove: {
              _id: id,
            },
          } as { paymentRemove: { _id: string } },
        });
        // Use window.alert as a fallback if Alert is not available
        window.alert('Payment removed successfully');
      } catch (error) {
        console.error('Error removing payment:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const payments = data?.payments || [];

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Button variant="default" onClick={handleAddClick}>
          Add Payment
        </Button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {payments.map((payment) => (
          <div 
            key={payment._id} 
            style={{ 
              padding: '1rem', 
              border: '1px solid #eee',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <h4 style={{ margin: '0 0 0.5rem' }}>{payment.name}</h4>
              <p style={{ margin: '0.25rem 0' }}>Type: {payment.kind}</p>
              <p style={{ margin: '0.25rem 0' }}>Status: {payment.status}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="link" onClick={() => handleEditClick(payment)}>
                Edit
              </Button>
              <Button 
                variant="link" 
                onClick={() => handleRemove(payment._id)}
                style={{ color: '#ef4444' }}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <PaymentFormSheet
        show={showForm}
        payment={currentPayment}
        onClose={() => setShowForm(false)}
        kind={currentPayment?.kind || 'custom'}
      />
    </div>
  );
};

export default PaymentList;
