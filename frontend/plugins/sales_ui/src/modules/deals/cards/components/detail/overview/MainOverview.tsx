import { IDeal } from '@/deals/types/deals';
import LabelChooser from './label/LabelChooser';
import { SelectMember } from 'ui-modules';
import { useDealsContext } from '@/deals/context/DealContext';

const MainOverview = ({ deal }: { deal: IDeal }) => {
  const { editDeals } = useDealsContext();
  console.log('ddd', deal);
  const handleAssignMembers = (value: string | string[]) => {
    editDeals({
      variables: {
        _id: deal._id,
        assignedUserIds: [value],
      },
    });
  };

  return (
    <div className="border-b py-4 px-8">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="uppercase text-sm text-gray-500 pb-4">Assigned to</h4>
          <SelectMember
            value={deal.assignedUserIds}
            onValueChange={handleAssignMembers}
            className="text-foreground"
          />
        </div>
        <div>
          <h4 className="uppercase text-sm text-gray-500 pb-4">Label</h4>
          <LabelChooser />
        </div>
        <div>
          <h4 className="uppercase text-sm text-gray-500 pb-4">Priority</h4>
        </div>
        <div>
          <h4 className="uppercase text-sm text-gray-500 pb-4">Tags</h4>
        </div>
        <div>
          <h4 className="uppercase text-sm text-gray-500 pb-4">Departments</h4>
        </div>
        <div>
          <h4 className="uppercase text-sm text-gray-500 pb-4">Branches</h4>
        </div>
        <div>
          <h4 className="uppercase text-sm text-gray-500 pb-4">Customers</h4>
        </div>
        <div>
          <h4 className="uppercase text-sm text-gray-500 pb-4">Companies</h4>
        </div>
      </div>
    </div>
  );
};

export default MainOverview;
