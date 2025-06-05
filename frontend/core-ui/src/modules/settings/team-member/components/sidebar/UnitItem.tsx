import { CollapsibleItemWrapper } from '@/settings/team-member/components/sidebar/CollapsibleItemWrapper';
import { UnitFilter } from '@/settings/team-member/components/header/UnitFilter';

export function UnitItem() {
  return (
    <CollapsibleItemWrapper label="Unit" open={true}>
      <div className="pl-9">
        <UnitFilter />
      </div>
    </CollapsibleItemWrapper>
  );
}
