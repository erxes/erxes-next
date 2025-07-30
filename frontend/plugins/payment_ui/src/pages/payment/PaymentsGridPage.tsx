import { useQuery } from '@apollo/client';
import PaymentMethodCard from '~/modules/payment/components/PaymentMethodCard';
import { PAYMENT_KINDS } from '~/modules/payment/constants';
import { COUNTS } from '~/modules/payment/graphql/queries';
import { ScrollArea } from 'erxes-ui';

const PaymentMethods = () => {
  const { data } = useQuery(COUNTS, {
    fetchPolicy: 'cache-and-network',
  });

  return (
    <ScrollArea>
      <div className="h-full w-full mx-auto max-w-3xl px-8 py-5 flex flex-col gap-8">
        <div className="flex flex-col gap-2 px-1">
          <h1 className="text-lg font-semibold">Payment methods</h1>
          <span className="font-normal text-muted-foreground text-sm">
            Set up your payment methods and receive payments from your customers
          </span>
        </div>
        {/* payments grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(PAYMENT_KINDS).map(([key, payment]) => (
            <PaymentMethodCard
              key={key}
              name={payment.name}
              description={payment.description}
              count={data?.paymentsTotalCount?.byKind[key] || 0}
              kind={key}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default PaymentMethods;
