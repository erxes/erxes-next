import { useQuery } from '@apollo/client';
import queries from '../graphql/queries';
import { ListQueryResponse } from '../types';
import { PluginHeader, RecordTable, useQueryState } from 'erxes-ui';
import {
  IconArchive,
  IconChartPie,
  IconEdit,
  IconPlus,
  IconSettings,
} from '@tabler/icons-react';
import { Button, Sheet, Spinner, Table } from 'erxes-ui/components';
import { Link } from 'react-router';
import columns from './RowColumns';
import Detail from './Detail';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

export default function Segments() {
  const [selectedContentType] = useQueryState('contentType');
  const [, setOpen] = useQueryState('segmentId');
  const [expanded, setExpanded] = useState({});

  const { data, loading, refetch } = useQuery<ListQueryResponse>(
    queries.segments,
    {
      variables: { contentTypes: [selectedContentType] },
    },
  );

  const { segments = [] } = data || {};

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col h-full p-3 pt-0">
      <PluginHeader
        title="Segments"
        icon={IconChartPie}
        className="p-3 mx-0"
        separatorClassName="mb-0"
      >
        <Detail refetch={refetch} />
      </PluginHeader>
      <RecordTable.Provider
        columns={columns}
        data={segments}
        // handleReachedBottom={handleFetchMore}
        stickyColumns={['name']}
        disableCheckbox
        className="mt-1.5"
        moreColumn={{
          id: 'more',
          cell: ({ cell }) => (
            <Button
              variant="ghost"
              className="w-full h-full"
              onClick={() => setOpen(cell.row.original._id)}
            >
              <IconEdit className="hover:text-accent-foreground" />
            </Button>
          ),
          size: 13,
        }}
      >
        <RecordTable className="w-full">
          <RecordTable.Header />
          <RecordTable.Body>
            {loading && <RecordTable.RowSkeleton rows={40} />}

            <RecordTable.CursorRowList />
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.Provider>
    </div>
  );
}
