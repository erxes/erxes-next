import { gql, useQuery } from '@apollo/client';
import {
  IconCaretDownFilled,
  IconLogs,
  IconSandbox,
  IconSettings,
} from '@tabler/icons-react';
import { Button, PluginHeader, RecordTable } from 'erxes-ui';
import { Link } from 'react-router-dom';
import Payload from '~/modules/app/components/Payload';
import queries from '../graphql/queries';
import columns from './RowColumns';
const List = () => {
  const { data, loading, fetchMore } = useQuery<QueryResponse>(
    gql(queries.mainList),
  );

  if (loading) {
    return <>Loading...</>;
  }

  const { list = [], totalCount = 0 } = data?.logsMainList || {};

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
      <PluginHeader
        title="Logs"
        icon={IconLogs}
        className="p-3 mx-0"
        separatorClassName="mb-0"
      >
        <Button variant="outline" asChild>
          <Link to="/settings/sample">
            <IconSettings />
            Go to settings
          </Link>
        </Button>
        <Button>
          More <IconCaretDownFilled />
        </Button>
      </PluginHeader>
      <RecordTable.Provider
        columns={columns}
        data={list}
        handleReachedBottom={handleFetchMore}
        // stickyColumns={['avatar', 'name']}
        disableCheckbox
        className="mt-1.5"
        moreColumn={{
          id: 'detail',
          cell: ({ cell }) => {
            const { payload, ...doc } = cell?.row?.original || {};
            return (
              <Payload doc={{ ...doc, payload: JSON.parse(payload || '{}') }} />
            );
          },
          size: 33,
        }}
      >
        <RecordTable className="w-full">
          <RecordTable.Header />
          <RecordTable.Body>
            {totalCount > list?.length && (
              <RecordTable.RowSkeleton
                rows={2}
                handleReachedBottom={handleFetchMore}
              />
            )}
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.Provider>
    </div>
  );
};

export default List;
