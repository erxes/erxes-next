import {
  IconFolder,
  IconGitBranch,
  IconHash,
  IconLabelFilled,
  IconUsersGroup,
} from '@tabler/icons-react';
import {
  Filter,
  PageSubHeader,
  useFilterContext,
  useMultiQueryState,
  useQueryState,
} from 'erxes-ui';
import { SelectBranchTree, SelectDepartmentTree, SelectUnit } from 'ui-modules';
import { TeamMemberFilter } from './TeamMemberFilter';
import { TeamMemberCounts } from '../TeamMemberCounts';

export const TeamMemberFilterBar = () => {
  const [queries] = useMultiQueryState<{
    code: string;
    name: string;
    branchId: string;
    departmentId: string;
    unitId: string;
  }>(['code', 'name', 'branchId', 'departmentId', 'unitId']);

  const isFiltered = Object.values(queries).some((query) => !!query);

  const { code, name, branchId, departmentId, unitId } = queries;

  return (
    <Filter id="team-member">
      <PageSubHeader>
        <Filter.Bar>
          <TeamMemberFilter />
          {!!code && (
            <Filter.BarItem>
              <Filter.BarName>
                <IconHash />
                Code
              </Filter.BarName>
              <Filter.BarButton filterKey="code" inDialog>
                {code}
              </Filter.BarButton>
              <Filter.BarClose filterKey="code" />
            </Filter.BarItem>
          )}
          {!!name && (
            <Filter.BarItem>
              <Filter.BarName>
                <IconLabelFilled />
                Name
              </Filter.BarName>
              <Filter.BarButton filterKey="name" inDialog>
                {name}
              </Filter.BarButton>
              <Filter.BarClose filterKey="name" />
            </Filter.BarItem>
          )}
          {!!branchId && <BranchFilterBar />}
          {!!departmentId && <DepartmentFilterBar />}
          {!!unitId && <UnitFilterBar />}
          <TeamMemberCounts />
        </Filter.Bar>
      </PageSubHeader>
    </Filter>
  );
};

const BranchFilterBar = () => {
  const [branchId, setBranchId] = useQueryState<string>('branchId');
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconGitBranch />
        Branch
      </Filter.BarName>
      <SelectBranchTree
        selected={branchId ?? undefined}
        onSelect={(value) => {
          setBranchId(value);
          resetFilterState();
        }}
        recordId="branchId"
        className="h-7 shadow-none rounded-none"
      />
      <Filter.BarClose filterKey="branchId" />
    </Filter.BarItem>
  );
};

const DepartmentFilterBar = () => {
  const [departmentId, setDepartmentId] = useQueryState<string>('departmentId');
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconFolder />
        Department
      </Filter.BarName>
      <SelectDepartmentTree
        selected={departmentId ?? undefined}
        onSelect={(value) => {
          setDepartmentId(value);
          resetFilterState();
        }}
        recordId="departmentId"
        className="h-7 shadow-none rounded-none"
      />
      <Filter.BarClose filterKey="departmentId" />
    </Filter.BarItem>
  );
};

const UnitFilterBar = () => {
  const [unitId, setUnitId] = useQueryState<string>('unitId');
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconUsersGroup />
        Unit
      </Filter.BarName>
      <SelectUnit
        value={unitId ?? undefined}
        onValueChange={(value) => {
          setUnitId(value);
          resetFilterState();
        }}
        className="h-7 rounded-none shadow-none"
      />
      <Filter.BarClose filterKey="unitId" />
    </Filter.BarItem>
  );
};
