import { gql, useQuery } from '@apollo/client';
import { Button } from 'erxes-ui/components';
import { Link } from 'react-router-dom';
import queries from '../graphql/queries';
import { IAutomationDoc } from '../types';
import { IPageInfo, SelectTags } from 'ui-modules';
import {
  RecordTable,
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
} from 'erxes-ui/modules';
import { useState } from 'react';
import { columns } from './Columns';

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
    return <>Loading...</>;
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
      <Button asChild>
        <Link to={'/automations/edit/1'}>Add</Link>
      </Button>
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
                startCursor={startCursor}
              />
              {loading && <RecordTable.RowSkeleton rows={40} />}
              <RecordTable.RowList />
              <RecordTable.CursorForwardSkeleton
                handleFetchMore={handleFetchMore}
                endCursor={endCursor}
              />
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.CursorProvider>
      </RecordTable.Provider>
    </>
  );
};

export default List;
