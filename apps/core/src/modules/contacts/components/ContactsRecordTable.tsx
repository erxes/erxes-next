import {
  IconAlignLeft,
  IconChevronDown,
  IconHistory,
  IconMail,
  IconMapPin,
  IconPhone,
} from '@tabler/icons-react';

import { IconList } from '@tabler/icons-react';
import { Button } from 'erxes-ui/components';
import { RecordTable } from 'erxes-ui/modules/record-table';
import {
  CUSTOMERS_PER_PAGE,
  useCustomers,
} from '@/contacts/hooks/useCustomers';
import { IRecordTableColumn } from 'erxes-ui/modules/record-table/types/recordTableTypes';

const columns: IRecordTableColumn[] = [
  {
    id: 'firstName',
    label: 'First Name',
    icon: IconAlignLeft,
    type: 'handle',
    readOnly: true,
  },
  {
    id: 'middleName',
    label: 'Middle Name',
    icon: IconAlignLeft,
    type: 'handle',
    readOnly: true,
  },
  {
    id: 'lastName',
    label: 'Last Name',
    icon: IconAlignLeft,
    type: 'handle',
    readOnly: true,
  },
  {
    id: 'email',
    label: 'Email',
    icon: IconMail,
    type: 'handle',
    readOnly: true,
  },
  {
    id: 'phone',
    label: 'Phone',
    icon: IconPhone,
    type: 'handle',
    readOnly: true,
  },
  {
    id: 'createdAt',
    label: 'Created At',
    icon: IconHistory,
    type: 'date',
  },
  {
    id: 'country',
    label: 'Country',
    icon: IconMapPin,
    type: 'handle',
    readOnly: true,
  },
  {
    id: 'sessionCount',
    label: 'Session Count',
    icon: IconHistory,
    type: 'number',
  },
];

export const ContactsRecordTable = () => {
  const { customers, handleFetchMore, loading, totalCount } = useCustomers({
    variables: {
      perPage: CUSTOMERS_PER_PAGE,
      page: 1,
      type: 'customer',
    },
  });

  const getFetchValueHook = () => {
    return () => ({ loading: false, options: [] });
  };

  const useMutateValueHook = () => {
    return () => ({ loading: false, mutate: () => {} });
  };
  return (
    <>
      <div>
        <Button variant="ghost" className="text-muted-foreground">
          <IconList className="w-4 h-4" />
          <span className="inline-flex items-center">
            All
            <span className="mx-1 pb-px">•</span>
            {totalCount}
          </span>
          <IconChevronDown className="w-4 h-4" />
        </Button>
      </div>
      {loading ? (
        <>loading</>
      ) : (
        <>
          <RecordTable.Provider
            useMutateValueHook={useMutateValueHook}
            columns={columns as IRecordTableColumn[]}
            data={customers || []}
            handleReachedBottom={handleFetchMore}
            getFetchValueHook={getFetchValueHook}
          >
            <RecordTable>
              <RecordTable.Header />
              <RecordTable.Body>
                {!loading && totalCount > customers?.length && (
                  <RecordTable.RowSkeleton
                    rows={4}
                    handleReachedBottom={handleFetchMore}
                  />
                )}
              </RecordTable.Body>
            </RecordTable>
            {/* <ProductCommandBar /> */}
          </RecordTable.Provider>
        </>
      )}
    </>
  );
};
