import { RecordTable, Resizable } from 'erxes-ui';

import { typesColumns } from '~/modules/cms/components/TypesColumns';
const types = [
  {
    _id: 'w4wSQq-gXYL0-OhME-Mkc',
    code: 'movie',
    createdAt: '2025-03-31T09:11:14.606Z',
    description: 'movies',
    label: 'movie',
    pluralLabel: 'movies',
    __typename: 'CustomPostType',
  },
  {
    _id: 'w4wSQq-gXYL0-OhME-Mkc',
    code: 'movie',
    createdAt: '2025-03-31T09:11:14.606Z',
    description: 'movies',
    label: 'movie',
    pluralLabel: 'movies',
    __typename: 'CustomPostType',
  },
  {
    _id: 'w4wSQq-gXYL0-OhME-Mkc',
    code: 'movie',
    createdAt: '2025-03-31T09:11:14.606Z',
    description: 'movies',
    label: 'movie',
    pluralLabel: 'movies',
    __typename: 'CustomPostType',
  },
];

export const CmsCustomTypePage = () => {
  //   const data = usePostLists();

  return (
    <RecordTable.Provider
      columns={typesColumns}
      data={types}
      className="mt-1.5"
    >
      <RecordTable>
        <RecordTable.Header />
        <RecordTable.Body>
          {/* {!loading && totalCount > customers?.length && (
          <RecordTable.RowSkeleton
            rows={4}
            handleReachedBottom={handleFetchMore}
          />
        )} */}
        </RecordTable.Body>
      </RecordTable>
    </RecordTable.Provider>
  );
};
