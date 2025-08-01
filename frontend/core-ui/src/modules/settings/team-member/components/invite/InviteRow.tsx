import { IUserEntry, TUserForm } from '../../types';
import { useUserInviteContext } from '../../hooks/useUserInviteContext';
import { InviteMemberRowContext } from '../../context/InviteMemberContext';
import { cn, Form, Input, Table } from 'erxes-ui';
import { InviteRowCheckbox } from './InviteRowCheckbox';
import { useFormContext } from 'react-hook-form';
import {
  SelectBranches,
  SelectDepartments,
  SelectUnit,
  SelectUsersGroup,
} from 'ui-modules';

export const InviteRow = ({
  userIndex,
  user,
}: {
  userIndex: number;
  user: IUserEntry & { id: string };
}) => {
  const { selectedUsers, fields } = useUserInviteContext();
  const { control } = useFormContext<TUserForm>();
  return (
    <InviteMemberRowContext.Provider
      value={{
        userIndex,
        user,
      }}
    >
      <Table.Row
        key={user.id}
        data-state={
          selectedUsers?.includes(user.id) ? 'selected' : 'unselected'
        }
        className="overflow-hidden h-cell"
      >
        <Table.Cell
          className={cn('overflow-hidden', {
            'rounded-tl-lg border-t': userIndex === 0,
            'rounded-bl-lg': userIndex === fields?.length - 1,
          })}
        >
          <div className="w-9 flex items-center justify-center">
            <InviteRowCheckbox userId={user.id} />
          </div>
        </Table.Cell>
        <Table.Cell
          className={cn({
            'border-t': userIndex === 0,
          })}
        >
          <Form.Field
            control={control}
            name={`entries.${userIndex}.email`}
            render={({ field }) => (
              <Form.Item>
                <Form.Control>
                  <Input
                    {...field}
                    placeholder="Email"
                    type={'email'}
                    autoComplete="new-email"
                    className="rounded-none focus-visible:relative focus-visible:z-10 shadow-none"
                  />
                </Form.Control>
              </Form.Item>
            )}
          />
        </Table.Cell>
        <Table.Cell
          className={cn({
            'border-t': userIndex === 0,
          })}
        >
          <Form.Field
            control={control}
            name={`entries.${userIndex}.password`}
            render={({ field }) => (
              <Form.Item>
                <Form.Control>
                  <Input
                    {...field}
                    placeholder="Password"
                    autoComplete={`new-password`}
                    type="password"
                    className="rounded-none focus-visible:relative focus-visible:z-10 shadow-none"
                  />
                </Form.Control>
              </Form.Item>
            )}
          />
        </Table.Cell>
        <Table.Cell
          className={cn({
            'border-t': userIndex === 0,
          })}
        >
          <Form.Field
            control={control}
            name={`entries.${userIndex}.groupId`}
            render={({ field }) => {
              console.log('field', field)
              return (
                <Form.Item>
                  <Form.Control>
                    <SelectUsersGroup.FormItem
                      mode="single"
                      onValueChange={field.onChange}
                      value={field.value}
                      className="rounded-none focus-visible:relative focus-visible:z-10 shadow-none"
                    />
                  </Form.Control>
                </Form.Item>
              );
            }}
          />
        </Table.Cell>
        <Table.Cell
          className={cn({
            'border-t': userIndex === 0,
          })}
        >
          <Form.Field
            control={control}
            name={`entries.${userIndex}.unitId`}
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Control>
                    <SelectUnit.FormItem
                      onValueChange={field.onChange}
                      value={field.value}
                      className="rounded-none focus-visible:relative focus-visible:z-10 shadow-none"
                    />
                  </Form.Control>
                </Form.Item>
              );
            }}
          />
        </Table.Cell>
        <Table.Cell
          className={cn({
            'border-t': userIndex === 0,
          })}
        >
          <Form.Field
            control={control}
            name={`entries.${userIndex}.departmentId`}
            render={({ field }) => (
              <Form.Item>
                <SelectDepartments.FormItem
                  mode="single"
                  onValueChange={field.onChange}
                  value={field.value}
                  className="rounded-none focus-visible:relative focus-visible:z-10 shadow-none"
                />
              </Form.Item>
            )}
          />
        </Table.Cell>
        <Table.Cell
          className={cn(
            {
              'rounded-tr-lg border-t': userIndex === 0,
              'rounded-br-lg': userIndex === fields?.length - 1,
            },
            'overflow-hidden',
          )}
        >
          <Form.Field
            control={control}
            name={`entries.${userIndex}.branchId`}
            render={({ field }) => (
              <Form.Item>
                <SelectBranches.FormItem
                  onValueChange={field.onChange}
                  value={field.value}
                  mode="single"
                  className="rounded-none focus-visible:relative focus-visible:z-10 shadow-none"
                />
              </Form.Item>
            )}
          />
        </Table.Cell>
      </Table.Row>
    </InviteMemberRowContext.Provider>
  );
};
