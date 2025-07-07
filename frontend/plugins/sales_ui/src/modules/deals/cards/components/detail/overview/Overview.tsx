import { AttachmentProvider } from './attachments/AttachmentContext';
import AttachmentUploader from './attachments/AttachmentUploader';
import Attachments from './attachments/Attachments';
import ChecklistOverview from './checklist/ChecklistOverview';
import { Checklists } from './checklist/Checklists';
import { DealsProvider } from '@/deals/context/DealContext';
import { IAttachment } from '@/deals/types/attachments';
import { IDeal } from '@/deals/types/deals';
import SalesDescription from './SalesDescription';

const OverviewContent = () => {
  return (
    <>
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
    </>
  );
};

const Overview = ({ deal }: { deal: IDeal }) => {
  console.log('deal attachments:', deal.attachments);
  return (
    <DealsProvider>
      <AttachmentProvider
        initialAttachments={deal.attachments || ([] as IAttachment[])}
      >
        <OverviewContent />
      </AttachmentProvider>
    </DealsProvider>
  );
};

export default Overview;
