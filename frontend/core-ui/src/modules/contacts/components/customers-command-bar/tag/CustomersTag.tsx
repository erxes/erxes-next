import { SelectTags, useGiveTags } from 'ui-modules';
import { InlineCellDisplay } from 'erxes-ui/modules';
import { IconTag } from '@tabler/icons-react';
import { ApolloError } from '@apollo/client';
import { toast } from 'erxes-ui';
import { GET_CUSTOMERS } from '@/contacts/graphql/queries/getCustomers';
import { ICustomer } from '@/contacts/types/customerType';
interface CustomersTagProps {
  customerIds: string[];
}

export const CustomersTag = ({ customerIds }: CustomersTagProps) => {
  const { giveTags } = useGiveTags();
  return (
    <SelectTags
      tagType="core:customer"
      recordId={'customersCommandBAR'}
      onSelect={(tagIds: string[] | string) => {
        giveTags({
          variables: {
            type: 'core:customer',
            targetIds: customerIds,
            tagIds: tagIds,
          },
          update: (cache) => {
            cache.updateQuery(
              {
                query: GET_CUSTOMERS,
                variables: {
                  perPage: 30,
                  dateFilters: null,
                },
              },
              ({ customersMain }) => {
                return {
                  customersMain: {
                    ...customersMain,
                    list: customersMain.list.map((customer: ICustomer) => {
                      if (customerIds.includes(customer._id)) {
                        return {
                          ...customer,
                          tagIds: [...(customer.tagIds || []), ...tagIds],
                        };
                      }
                      return customer;
                    }),
                    totalCount: customersMain.totalCount + 1,
                  },
                };
              },
            );
            cache.modify({
              id: cache.identify({
                __typename: 'Customer',
                _id: customerIds,
              }),
              fields: { tagIds: () => tagIds },
            });
          },
          onError: (e: ApolloError) => {
            toast({
              title: 'Error',
              description: e.message,
            });
          },
        });
      }}
      display={() => (
        <InlineCellDisplay
          className="h-7 p-1 mt-[2px] justify-center font-medium px-2"
          variant={'secondary'}
        >
          <IconTag />
          Add Tag
        </InlineCellDisplay>
      )}
    />
  );
};
