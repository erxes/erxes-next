import { AttachmentProvider } from './attachments/AttachmentContext';
import AttachmentUploader from './attachments/AttachmentUploader';
import Attachments from './attachments/Attachments';
import ChecklistOverview from './checklist/ChecklistOverview';
import { Checklists } from './checklist/Checklists';
import { DealsProvider } from '@/deals/context/DealContext';
import SalesDescription from './SalesDescription';

const Overview = () => {
  return (
    <DealsProvider>
      <AttachmentProvider>
        <div className="border-b">
          <SalesDescription />
          <div className="flex gap-4 py-2 px-4">
            <ChecklistOverview />
            <AttachmentUploader />
          </div>
        </div>
        <div className="border-b">
          <Attachments />
        </div>
        <div className="overview">
          <Checklists />
        </div>
      </AttachmentProvider>
    </DealsProvider>
  );
};

export default Overview;
