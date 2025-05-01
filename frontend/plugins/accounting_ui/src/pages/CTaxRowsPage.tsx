import { CTaxRowsTable } from '@/settings/ctax/components/CTaxsTable';

export const CTaxRowsPage = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-auto p-3 overflow-hidden flex">
        <CTaxRowsTable />
      </div>
    </div>
  );
};
