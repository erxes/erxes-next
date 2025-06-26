import Checklist from './checklist/ChecklistOverview';
import SalesDescription from './SalesDescription';

const Overview = () => {
  return (
    <div>
      <div className="border-b">
        <SalesDescription />
        <div className="flex gap-4 py-2 px-4">
          <Checklist />
          {/* <Attachments/> */}
        </div>
      </div>
    </div>
  );
};

export default Overview;
