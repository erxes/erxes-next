import { RecordTable, Resizable } from 'erxes-ui';
import { fieldsColumns } from '~/modules/cms/components/FieldsColumns';

const fields = [
  {
    _id: 'DPJhiJ1cG3htbo4DD6K9b',
    code: 'movie',
    text: 'budget',
    type: 'input',
    validation: '',
    order: 0,
    options: [],
    optionsValues: null,
    __typename: 'Field',
  },
  {
    _id: 'DPJhiJ1cG3htbo4DD6K9b',
    code: 'movie',
    text: 'budget',
    type: 'input',
    validation: '',
    order: 0,
    options: [],
    optionsValues: null,
    __typename: 'Field',
  },
  {
    _id: 'DPJhiJ1cG3htbo4DD6K9b',
    code: 'movie',
    text: 'budget',
    type: 'input',
    validation: '',
    order: 0,
    options: [],
    optionsValues: null,
    __typename: 'Field',
  },
  {
    _id: 'DPJhiJ1cG3htbo4DD6K9b',
    code: 'movie',
    text: 'budget',
    type: 'input',
    validation: '',
    order: 0,
    options: [],
    optionsValues: null,
    __typename: 'Field',
  },
];

export const CmsCustomFieldPage = () => {
  return (
    <RecordTable.Provider
      columns={fieldsColumns}
      data={fields}
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
