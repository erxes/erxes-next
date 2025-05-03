import { useQuery } from '@apollo/client';
import { Spinner } from 'erxes-ui/components';
import { useQueryState } from 'erxes-ui/hooks';
import { useEffect } from 'react';
import List from '~/modules/segments/components/List';
import { ListSidebar } from '~/modules/segments/components/Sidebar';
import queries from '~/modules/segments/graphql/queries';

export default function Segments() {
  const [contentType, setType] = useQueryState<string>('contentType');
  const { data, loading } = useQuery(queries.segmentsGetTypes);

  useEffect(() => {
    if (!loading && data?.segmentsGetTypes?.length) {
      const [type] = data.segmentsGetTypes;
      if (type && !contentType) {
        setType(type.contentType);
      }
    }
  }, [loading, data, contentType, setType]);

  if (loading) {
    return <Spinner />;
  }

  const { segmentsGetTypes = [] } = data || {};

  return (
    <div className="flex flex-row h-full">
      <ListSidebar types={segmentsGetTypes} />
      <List />
    </div>
  );
}
