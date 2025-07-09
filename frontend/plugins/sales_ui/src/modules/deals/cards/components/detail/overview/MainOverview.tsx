import ChooseDepartment from './ChooseDepartment';
import { IDeal } from '@/deals/types/deals';
import LabelChooser from './label/LabelChooser';
import Priority from './Priority';
import { SelectMember } from 'ui-modules';
import SelectTags from './tags/SelectTags';
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
          <h4 className="uppercase text-sm text-gray-500 pb-2">Assigned to</h4>
          <SelectMember
            value={deal.assignedUserIds}
            onValueChange={handleAssignMembers}
            className="text-foreground"
          />
        </div>
        <div>
          <h4 className="uppercase text-sm text-gray-500 pb-2">Label</h4>
          <LabelChooser />
        </div>
        <div>
          <h4 className="uppercase text-sm text-gray-500 pb-2">Priority</h4>
          <Priority priority={deal.priority || ''} dealId={deal._id} />
        </div>
        <div>
          <h4 className="uppercase text-sm text-gray-500 pb-2">Tags</h4>
          <SelectTags />
        </div>
        <div>
          <h4 className="uppercase text-sm text-gray-500 pb-2">Departments</h4>
          {/* <ChooseDepartment /> */}
        </div>
        <div>
          <h4 className="uppercase text-sm text-gray-500 pb-2">Branches</h4>
        </div>
        <div>
          <h4 className="uppercase text-sm text-gray-500 pb-2">Customers</h4>
        </div>
        <div>
          <h4 className="uppercase text-sm text-gray-500 pb-2">Companies</h4>
        </div>
      </div>
    </div>
  );
};

export default MainOverview;
