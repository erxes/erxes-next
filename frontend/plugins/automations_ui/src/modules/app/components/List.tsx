import { gql, useQuery } from '@apollo/client';
import { Breadcrumb, Button, Separator, Spinner } from 'erxes-ui/components';
import { Link } from 'react-router-dom';
import queries from '../graphql/queries';
import { IAutomationDoc } from '../types';
import { IPageInfo, SelectTags } from 'ui-modules';
import { PageHeader } from 'ui-modules';
import { useState } from 'react';
import { columns } from './Columns';
import { IconCaretDownFilled, IconSettings } from '@tabler/icons-react';
import { RecordTable } from 'erxes-ui/modules';

type QueryResponse = {
  automationsMain: {
    list: IAutomationDoc[];
    totalCount: number;
    pageInfo: IPageInfo;
  };
};

const List = () => {
  const { data, loading, fetchMore } = useQuery<QueryResponse>(
    queries.mainList,
    {},
  );

  if (loading) {
    return <Spinner />;
  }

  const { list = [], totalCount = 0, pageInfo } = data?.automationsMain || {};
  const { hasPreviousPage, hasNextPage, startCursor, endCursor } =
    pageInfo || {};

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
                <Button variant="ghost" asChild>
                  <Link to="/settings/automations">
                    <IconSettings />
                    Go to settings
                  </Link>
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
      <RecordTable.Provider
        columns={columns}
        data={list}
        stickyColumns={['more', 'checkbox', 'avatar', 'name']}
        className="m-3"
      >
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
    </>
  );
};

export default List;
