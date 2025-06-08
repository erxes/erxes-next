import { IconChartPie } from '@tabler/icons-react';
import { PageSubHeader, RecordTable, Skeleton, Spinner } from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { LOGS_CURSOR_SESSION_KEY } from '../constants/logFilter';
import { useLogs } from '../hooks/useLogs';
import { logColumns } from './LogColumns';
import { LogsRecordTableFilter } from './filters/LogsRecordTableFilter';

export const LogsRecordTable = () => {
  const {
    loading,
    totalCount,
    list,
    handleFetchMore,
    hasNextPage,
    hasPreviousPage,
  } = useLogs();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col h-full p-3 pt-0">
      <PageHeader className="p-3 mx-0" separatorClassName="mb-0">
        <PageHeader.Start>
          <IconChartPie className="w-5 h-5" />
          <span className="font-medium">System Logs</span>
        </PageHeader.Start>
      </PageHeader>
      <PageSubHeader>
        <LogsRecordTableFilter />
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
          sessionKey={LOGS_CURSOR_SESSION_KEY}
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
