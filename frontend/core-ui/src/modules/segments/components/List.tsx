import { useQuery } from '@apollo/client';
import { IconChartPie } from '@tabler/icons-react';
import { Spinner } from 'erxes-ui/components';
import { useQueryState } from 'erxes-ui/hooks';
import { RecordTable, RecordTableTree } from 'erxes-ui/modules/record-table';
import { PageHeader } from 'ui-modules';
import queries from 'ui-modules/modules/segments/graphql/queries';
import { ISegment, ListQueryResponse } from 'ui-modules/modules/segments/types';
import Detail from './Detail';
import columns from './RowColumns';
import { useMemo } from 'react';

const generateOrderPath = (items: ISegment[]) => {
  const map = new Map(items.map((item) => [item._id, item]));

  const childrenMap = new Map();

  items.forEach((item) => {
    if (item.subOf) {
      if (!childrenMap.has(item.subOf)) {
        childrenMap.set(item.subOf, []);
      }
      childrenMap.get(item.subOf).push(item._id);
    }
  });

  const getOrder = (_id: string): any => {
    const item = map.get(_id);
    if (!item) return '';
    if (!item.subOf) return _id;
    return `${getOrder(item.subOf)}/${_id}`;
  };

  return items.map((item) => ({
    ...item,
    order: getOrder(item._id || ''),
    hasChildren: childrenMap.has(item._id),
  }));
};

export default function List() {
  const [selectedContentType] = useQueryState('contentType');

  const { data, loading, refetch } = useQuery<ListQueryResponse>(
    queries.segments,
    {
      variables: { contentTypes: [selectedContentType] },
    },
  );

  const { segments = [] } = data || {};

  const orderedSegments = useMemo(
    () => generateOrderPath(segments),
    [segments],
  );

  const segmentsObject = useMemo(() => {
    return orderedSegments.reduce(
      (
        acc: Record<string, { order: string } & ISegment>,
        segment: { order: string } & ISegment,
      ) => {
        acc[segment._id] = segment;
        return acc;
      },
      {},
    );
  }, [segments]);

  if (loading) {
    return <Spinner />;
  }
  console.log({ segmentsObject, orderedSegments });
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
        data={orderedSegments}
        stickyColumns={['name']}
        className="mt-1.5"
      >
        <RecordTableTree id="segments" ordered>
          <RecordTable.Scroll>
            <RecordTable className="w-full">
              <RecordTable.Header />
              <RecordTable.Body>
                <RecordTable.RowList
                  Row={(props) => (
                    <RecordTableTree.Row
                      {...props}
                      order={segmentsObject[props.id as string]?.order}
                      name={segmentsObject[props.id as string]?.name}
                    />
                  )}
                />
                {loading && <RecordTable.RowSkeleton rows={40} />}
              </RecordTable.Body>
            </RecordTable>
          </RecordTable.Scroll>
        </RecordTableTree>
      </RecordTable.Provider>
    </div>
  );
}
