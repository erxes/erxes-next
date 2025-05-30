import { gql, useQuery } from '@apollo/client';
import {
  IconCalendarPlus,
  IconChartPie,
  IconLabel,
  IconProgressCheck,
  IconSearch,
  IconSettings,
  IconSourceCode,
} from '@tabler/icons-react';
import {
  Combobox,
  Command,
  EnumCursorDirection,
  Filter,
  mergeCursorData,
  PageSubHeader,
  RecordTable,
  Skeleton,
  Spinner,
} from 'erxes-ui';
import { PageHeader, SelectMember, TagsFilter } from 'ui-modules';
import { LOGS_MAIN_LIST } from '../graphql/logQueries';
import { LogsMainListQueryResponse } from '../types';
import { logColumns } from './LogColumns';
import { LogsRecordTableFilter } from './LogsRecordTableFilter';
export const LogsRecordTable = () => {
  console.log({ fucker: 'dakdjabskds' });
  const { data, loading, fetchMore } = useQuery<LogsMainListQueryResponse>(
    gql(LOGS_MAIN_LIST),
  );

  if (loading) {
    return <Spinner />;
  }

  const { list = [], totalCount = 0, pageInfo } = data?.logsMainList || {};
  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  const handleFetchMore = ({
    direction,
  }: {
    direction: EnumCursorDirection;
  }) => {
    if (!list || !totalCount || totalCount <= list.length) {
      return;
    }
    fetchMore({
      variables: {
        cursor:
          direction === EnumCursorDirection.FORWARD
            ? pageInfo?.endCursor
            : pageInfo?.startCursor,
        limit: 20,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          logsMainList: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.logsMainList,
            prevResult: prev.logsMainList,
          }),
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
