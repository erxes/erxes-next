import { gql, useQuery } from '@apollo/client';
import { IconChartPie } from '@tabler/icons-react';
import { PageSubHeader, RecordTable, Skeleton, Spinner } from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { LogsMainListQueryResponse } from '../types';
import { logColumns } from './LogColumns';
import { LOGS_MAIN_LIST } from '../graphql/logQueries';
export const LogsRecordTable = () => {
  const { data, loading, fetchMore } = useQuery<LogsMainListQueryResponse>(
    gql(LOGS_MAIN_LIST),
  );

  if (loading) {
    return <Spinner />;
  }

  const { list = [], totalCount = 0, pageInfo } = data?.logsMainList || {};
  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  const handleFetchMore = () => {
    if (!list || !totalCount || totalCount <= list.length) {
      return;
    }
    fetchMore({
      variables: {
        page: Math.ceil(list.length / 20) + 1,
        perPage: 20,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          logsMainList: {
            ...prev.logsMainList,
            list: [
              ...(prev.logsMainList?.list || []),
              ...(fetchMoreResult.logsMainList?.list || []),
            ],
          },
        });
      },
    });
  };

  return (
    <div className="flex flex-col h-full p-3 pt-0">
      <PageHeader className="p-3 mx-0" separatorClassName="mb-0">
        <PageHeader.Start>
          <IconChartPie className="w-5 h-5" />
          <span className="font-medium">System Logs</span>
        </PageHeader.Start>
      </PageHeader>
      <PageSubHeader>
        <div className="text-muted-foreground font-medium text-sm whitespace-nowrap h-7 leading-7">
          {totalCount
            ? `${totalCount} records found`
            : loading && <Skeleton className="w-20 h-4 inline-block mt-1.5" />}
        </div>
      </PageSubHeader>
      <RecordTable.Provider columns={logColumns} data={list} className="mt-1.5">
        <RecordTable.CursorProvider
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          loading={loading}
          dataLength={list?.length}
          sessionKey="automations_cursor"
        >
          <RecordTable className="w-full">
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.CursorBackwardSkeleton
                handleFetchMore={handleFetchMore}
              />
              {loading && <RecordTable.RowSkeleton rows={40} />}
              <RecordTable.RowList />
              <RecordTable.CursorForwardSkeleton
                handleFetchMore={handleFetchMore}
              />
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.CursorProvider>
      </RecordTable.Provider>
    </div>
  );
};
