import { appsSettingsColumns } from '@/settings/apps/components/table/AppsSettingsColumns';
import { useAppsTokens } from '@/settings/apps/hooks/useAppsTokens';
import { IApp } from '@/settings/apps/types';
import { RecordTable } from 'erxes-ui';

export const AppsSettings = () => {
  const { apps, loading } = useAppsTokens();
  return (
    <section className="max-w-xl w-full mx-auto">
      <legend className="font-semibold text-lg pt-4 pb-6">Apps settings</legend>

      <RecordTable.Provider
        columns={appsSettingsColumns}
        data={apps as IApp[]}
      >
        <RecordTable className='w-full'>
          <RecordTable.Header />
          <RecordTable.Body>
            <RecordTable.RowList />
            {loading && <RecordTable.RowSkeleton rows={30} />}
          </RecordTable.Body>
        </RecordTable>
      </RecordTable.Provider>
    </section>
  );
};
