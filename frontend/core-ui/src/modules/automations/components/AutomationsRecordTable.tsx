import { useQuery } from '@apollo/client';
import { IconAffiliate, IconSettings } from '@tabler/icons-react';
import { Breadcrumb, Button, RecordTable, Separator, Spinner } from 'erxes-ui';
import { IPageInfo, PageHeader } from 'ui-modules';
import { AUTOMATIONS_MAIN_LIST } from '../graphql/automationQueries';
import { IAutomationDoc } from '../types';
import { automationColumns } from './AutomationColumns';
import { AutomationRecordTableFilters } from './AutomationRecordTableFilters';
import { Link } from 'react-router-dom';

type QueryResponse = {
  automationsMain: {
    list: IAutomationDoc[];
    totalCount: number;
    pageInfo: IPageInfo;
  };
};

export const AutomationsRecordTable = () => {
  const { data, loading, fetchMore } = useQuery<QueryResponse>(
    AUTOMATIONS_MAIN_LIST,
    {},
  );

  if (loading) {
    return <Spinner />;
  }

  const { list = [], totalCount = 0, pageInfo } = data?.automationsMain || {};
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
          automationsMain: {
            ...prev.automationsMain,
            list: [
              ...(prev.automationsMain?.list || []),
              ...(fetchMoreResult.automationsMain?.list || []),
            ],
          },
        });
      },
    });
  };

  return (
    <>
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost">
                  <IconAffiliate />
                  Automations
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
        </PageHeader.Start>
        <PageHeader.End>
          <Button variant="outline" asChild>
            <Link to="/settings/automations">
              <IconSettings />
              Go to settings
            </Link>
          </Button>
          <Button asChild>
            <Link to={'/automations/create'}>Add</Link>
          </Button>
        </PageHeader.End>
      </PageHeader>
      <AutomationRecordTableFilters loading={loading} totalCount={totalCount} />
      <RecordTable.Provider
        columns={automationColumns}
        data={list}
        stickyColumns={['more', 'checkbox', 'avatar', 'name']}
        className="m-3"
      >
        <RecordTable.CursorProvider
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
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
    </>
  );
};
