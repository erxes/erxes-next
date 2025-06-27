import { Filter, ScrollArea, Sidebar } from 'erxes-ui';
import { BranchItem } from './sidebar/BranchItem';
import { DepartmentItem } from './sidebar/DepartmentItem';
import { UnitItem } from './sidebar/UnitItem';

export function TeamMemberSidebar() {
  return (
    <Filter id="team-member">
      <Sidebar
        collapsible="none"
        className="border-r h-screen w-full max-w-[300px]"
      >
        <ScrollArea>
          <Sidebar.Group className="p-0 w-[300px]">
            <Sidebar.GroupContent>
              <BranchItem />
              <DepartmentItem />
              <UnitItem />
              {/* <SegmentItem /> */}
            </Sidebar.GroupContent>
          </Sidebar.Group>
          <ScrollArea.Bar />
        </ScrollArea>
      </Sidebar>
    </Filter>
  );
}
