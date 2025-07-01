import ChecklistOverview from './checklist/ChecklistOverview';
import { Checklists } from './checklist/Checklists';
import SalesDescription from './SalesDescription';

const Overview = () => {
  return (
    <div>
      <div className="border-b">
        <SalesDescription />
        <div className="flex gap-4 py-2 px-4">
          <ChecklistOverview />
          {/* <Attachments/> */}
        </div>
      </div>
      <div className="overview">
        <Checklists />
      </div>
    </div>
  );
};

export default Overview;
