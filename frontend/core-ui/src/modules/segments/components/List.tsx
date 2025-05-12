import { useQuery } from '@apollo/client';
import { IconChartPie } from '@tabler/icons-react';
import { Spinner } from 'erxes-ui/components';
import { useQueryState } from 'erxes-ui/hooks';
import { PageHeader } from 'erxes-ui/modules/header/PageHeader';
import { RecordTable } from 'erxes-ui/modules/record-table';
import { useState } from 'react';
import queries from 'ui-modules/modules/segments/graphql/queries';
import { ListQueryResponse } from 'ui-modules/modules/segments/types';
import Detail from './Detail';
import columns from './RowColumns';

export default function List() {
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
      <PageHeader className="p-3 mx-0" separatorClassName="mb-0">
        <PageHeader.Start>
          <IconChartPie className="w-5 h-5" />
          <span className="font-medium">Segments</span>
        </PageHeader.Start>
        <PageHeader.End>
          <Detail refetch={refetch} />
        </PageHeader.End>
      </PageHeader>
      <RecordTable.Provider
        columns={columns}
        data={segments}
        stickyColumns={['name']}
        className="mt-1.5"
      >
        <RecordTable className="w-full">
          <RecordTable.Header />
          <RecordTable.Body>
            {loading && <RecordTable.RowSkeleton rows={40} />}
            <RecordTable.RowList />
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.Provider>
    </div>
  );
}
