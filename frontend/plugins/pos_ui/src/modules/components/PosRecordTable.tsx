import { RecordTable } from 'erxes-ui';
import { columns } from './columns';
import { usePosList } from '../hooks/usePosList';
import { PosCommandBar } from './PosCommandBar';
import { usePosEnv } from '../hooks/usePosEnv';

const fakePosList = [
  {
    _id: "pos1",
    name: "Main Store POS",
    isOnline: true,
    onServer: true,
    branchTitle: "Downtown Branch",
    departmentTitle: "Sales",
    createdAt: new Date().toISOString()
  },
  {
    _id: "pos2",
    name: "Retail Counter 1",
    isOnline: false,
    onServer: true,
    branchTitle: "Mall Branch",
    departmentTitle: "Retail",
    createdAt: new Date(Date.now() - 86400000).toISOString() 
  },
  {
    _id: "pos3",
    name: "Mobile POS Unit",
    isOnline: true,
    onServer: false,
    branchTitle: "Events Branch",
    departmentTitle: "Mobile Sales",
    createdAt: new Date(Date.now() - 172800000).toISOString() 
  }
];

export const PosRecordTable = () => {
  const { data, loading } = usePosList({
    variables: {
      page: 1,
      perPage: 20,
    },
  });
  const { error, permissionError, posEnv, refetch } = usePosEnv();
  
  const posList = data?.posList || fakePosList;

  return (
    <RecordTable.Provider
      columns={columns}
      data={posList}
      className="mt-1.5"
      stickyColumns={['name']}
  >
      <RecordTable>
        <RecordTable.Header />
        {loading ? (
          <RecordTable.RowSkeleton rows={4} />
        ) : (
          <RecordTable.Body />
        )}
      </RecordTable>
      <PosCommandBar/>
    </RecordTable.Provider>
  );
};