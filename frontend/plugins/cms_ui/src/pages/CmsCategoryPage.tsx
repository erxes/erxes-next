import { RecordTable } from 'erxes-ui';

import { CategoryColumns } from '~/modules/category/components/CategoryColumns';
import { useGetCmsCategories } from '~/modules/category/hooks/useGetCmsCategories';

export const CmsCategoryPage = () => {
  const { data: categories } = useGetCmsCategories();
  // const categories = [
  //   {
  //     id: 1,
  //     name: 'cat',
  //     slug: 'cat 1 slug',
  //     createdAt: '2023-10-01',
  //     updatedAt: '2023-10-02',
  //     desc: 'cat 1 desc',
  //   },
  //   {
  //     id: 1,
  //     name: 'cat',
  //     slug: 'cat 1 slug',
  //     createdAt: '2023-10-01',
  //     updatedAt: '2023-10-02',
  //     desc: 'cat 1 desc',
  //   },
  //   {
  //     id: 1,
  //     name: 'cat',
  //     slug: 'cat 1 slug',
  //     createdAt: '2023-10-01',
  //     updatedAt: '2023-10-02',
  //     desc: 'cat 1 desc',
  //   },
  //   {
  //     id: 1,
  //     name: 'cat',
  //     slug: 'cat 1 slug',
  //     createdAt: '2023-10-01',
  //     updatedAt: '2023-10-02',
  //     desc: 'cat 1 desc',
  //   },
  //   {
  //     id: 1,
  //     name: 'cat',
  //     slug: 'cat 1 slug',
  //     createdAt: '2023-10-01',
  //     updatedAt: '2023-10-02',
  //     desc: 'cat 1 desc',
  //   },
  // ];

  return (
    <RecordTable.Provider
      columns={CategoryColumns}
      data={categories}
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
