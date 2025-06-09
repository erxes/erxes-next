import { useFormContext } from 'react-hook-form';
import { Form, Input, Skeleton, Textarea } from 'erxes-ui';
import {
  AssignMember,
  AssignMultipleMembers,
  SelectDepartmentTree,
} from 'ui-modules';
import { TDepartmentForm } from '../../types/department';

export const DepartmentForm = ({ loading }: { loading: boolean }) => {
  const { control } = useFormContext<TDepartmentForm>();

  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <Form.Field
        control={control}
        name="title"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>{field.name}</Form.Label>
            <Form.Control>
              <Input {...field} placeholder="Title" />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="code"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>{field.name}</Form.Label>
            <Form.Control>
              <Input {...field} placeholder="Code" />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="description"
        render={({ field }) => (
          <Form.Item className="col-span-2">
            <Form.Label>{field.name}</Form.Label>
            <Form.Control>
              <Textarea {...field} placeholder="Description" />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="supervisorId"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>{'Supervisor'}</Form.Label>
            <Form.Control>
              <AssignMember
                value={field.value}
                onValueChange={field.onChange}
              />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="parentId"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>{'Parent'}</Form.Label>
            <Form.Control>
              <SelectDepartmentTree
                recordId={'parentId'}
                selected={field.value}
                onSelect={field.onChange}
              />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="userIds"
        render={({ field }) => (
          <Form.Item className="col-span-2">
            <Form.Label>{'Team members'}</Form.Label>
            <Form.Control>
              <AssignMultipleMembers
                value={field.value}
                onValueChange={field.onChange}
              />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
    </div>
  );
};
