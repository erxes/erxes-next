import { RecordTable } from 'erxes-ui';

import { tagColumns } from '~/modules/tag/components/TagColumns';
import { useGetCmsTags } from '~/modules/tag/hooks/useGetCmsTags';

export const CmsTagPage = () => {
  const { data: tagss } = useGetCmsTags();
  const tags = [
    {
      id: 1,
      name: 'tag1',
      slug: 'tga 1 slug',
      createdAt: '2023-10-01',
      updatedAt: '2023-10-02',
    },
    {
      id: 1,
      name: 'tag1',
      slug: 'tga 1 slug',
      createdAt: '2023-10-01',
      updatedAt: '2023-10-02',
    },
    {
      id: 1,
      name: 'tag1',
      slug: 'tga 1 slug',
      createdAt: '2023-10-01',
      updatedAt: '2023-10-02',
    },
  ];

  return (
    <RecordTable.Provider columns={tagColumns} data={tags} className="mt-1.5">
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
