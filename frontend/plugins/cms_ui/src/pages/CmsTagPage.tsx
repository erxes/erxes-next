import { RecordTable, Resizable } from 'erxes-ui';

import { cmsColumns } from '~/modules/cms/components/CmsColumns';

const posts = [
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },

  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },

  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 1',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },

  {
    name: 'Post 2',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
  {
    name: 'Post 3',
    category: [
      { name: 'Category 1', id: 1 },
      { name: 'Category 2', id: 2 },
      { name: 'Category 3', id: 3 },
    ],
    tag: [
      { name: 'Tag 1', id: 1 },
      { name: 'Tag 2', id: 2 },
      { name: 'Tag 3', id: 3 },
    ],
    createdDate: '2023-10-01',
    modifiedDate: '2023-10-02',
  },
];

export const CmsTagPage = () => {
  return (
    <RecordTable.Provider columns={cmsColumns} data={posts} className="mt-1.5">
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
