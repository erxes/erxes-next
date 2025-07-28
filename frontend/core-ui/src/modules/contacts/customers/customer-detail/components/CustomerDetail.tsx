import { Separator, Sheet } from 'erxes-ui';
import { CustomerDetailActions } from './CustomerDetailActions';
import {
  CustomerDetailLayout,
  CustomerDetailTabContent,
} from '@/contacts/customers/customer-detail/components/CustomerDetailLayout';
import { CustomerDetailGeneral } from './CustomerDetailGeneral';
import { CustomerGeneral } from './CustomerGeneral';
import { CustomerProperties } from './CustomerProperties';
import { useCustomerDetail } from '@/contacts/customers/customer-detail/hooks/useCustomerDetail';
import { useToast } from 'erxes-ui';
import { ApolloError } from '@apollo/client';

export const CustomerDetail = () => {
  const { toast } = useToast();
  const { loading, error } = useCustomerDetail({
    onError: (e: ApolloError) => {
      toast({
        title: 'Error',
        description: e.message,
        variant: 'destructive',
      });
    },
  });
  return (
    <CustomerDetailLayout
      actions={<CustomerDetailActions />}
      otherState={loading ? 'loading' : error ? 'not-found' : undefined}
    >
      <div className="flex flex-auto">
        <Sheet.Content className="border-b-0 rounded-b-none">
          <CustomerDetailGeneral />
          <Separator />
          <CustomerDetailTabContent value="overview">
            <CustomerGeneral />
          </CustomerDetailTabContent>
          <CustomerDetailTabContent value="properties">
            <CustomerProperties />
          </CustomerDetailTabContent>
        </Sheet.Content>
      </div>
    </CustomerDetailLayout>
  );
};
