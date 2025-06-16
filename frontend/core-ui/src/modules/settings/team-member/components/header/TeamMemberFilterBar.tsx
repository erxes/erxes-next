import { Filter, PageSubHeader, useMultiQueryState } from 'erxes-ui';
import { SelectBranches, SelectDepartments, SelectUnit } from 'ui-modules';
import { TeamMemberFilterPopover } from './TeamMemberFilterPopover';
import { TeamMemberCounts } from '../TeamMemberCounts';
import { TEAM_MEMBER_CURSOR_SESSION_KEY } from '../../constants/teamMemberCursorSessionKey';

export const TeamMemberFilterBar = () => {
  const [queries] = useMultiQueryState<{
    branchIds: string;
    departmentIds: string;
    unitId: string;
    isActive: boolean;
  }>(['branchIds', 'departmentIds', 'unitId', 'isActive']);

  const isFiltered = Object.values(queries).some((query) => !!query);

  const { branchIds, departmentIds, unitId, isActive } = queries;

  return (
    <PageSubHeader>
      <Filter id="team-member" sessionKey={TEAM_MEMBER_CURSOR_SESSION_KEY}>
        <Filter.Bar>
          <TeamMemberFilterPopover />
          <Filter.Dialog>
            <Filter.View filterKey="searchValue" inDialog>
              <Filter.DialogStringView filterKey="searchValue" />
            </Filter.View>
          </Filter.Dialog>
          <Filter.SearchValueBarItem />
          {!!branchIds && (
            <SelectBranches.FilterBar
              mode={'multiple'}
              filterKey="branchIds"
              label="Branch"
            />
          )}
          {!!departmentIds && (
            <SelectDepartments.FilterBar
              mode={'multiple'}
              filterKey="departmentIds"
              label="Department"
            />
          )}
          {!!unitId && <SelectUnit.FilterBar />}
          <TeamMemberCounts />
        </Filter.Bar>
      </Filter>
    </PageSubHeader>
  );
};
