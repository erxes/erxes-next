import { RadioGroup, Skeleton } from 'erxes-ui';
import { TDepartment, useDepartment } from '../../hooks/useDepartment';
import { CollapsibleItemWrapper } from './CollapsibleItemWrapper';
import { ExpandableNode } from './ExpandableNode';

export function DepartmentItem() {
  const { departments, loading } = useDepartment({
    variables: {
      withoutUserFilter: true,
    },
  });
  const rootDepartments = departments?.filter(
    (dept: TDepartment) => !dept.parentId,
  );
  if (loading) {
    return (
      <div className="py-4 px-2">
        <Skeleton className="w-full h-32" />
      </div>
    );
  }

  return (
    <CollapsibleItemWrapper label="Departments" open>
      <RadioGroup className="w-full pl-9 flex flex-col">
        {rootDepartments.map((department: TDepartment, index: number) => (
          <ExpandableNode
            key={department._id}
            data={department}
            index={index}
            list={departments}
            parentIndex=""
            queryKey={'departmentId'}
          />
        ))}
      </RadioGroup>
    </CollapsibleItemWrapper>
  );
}
