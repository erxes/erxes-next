import { Skeleton } from 'erxes-ui/components';
import { CustomerInline, ICustomerInline } from 'ui-modules';

export const ConversationHeader = ({
  customerId,
  customer,
}: {
  customerId?: string;
  customer?: ICustomerInline;
}) => {
  return (
    <div className="h-12 flex items-center px-5 text-xs font-medium text-muted-foreground flex-none gap-3">
      Customer:
      {customerId || customer ? (
        <CustomerInline
          customerId={customerId}
          customer={customer}
          className="text-sm text-foreground"
          avatarProps={{ size: 'lg' }}
        />
      ) : (
        <Skeleton className="w-32 h-4 ml-2" />
      )}
    </div>
  );
};
