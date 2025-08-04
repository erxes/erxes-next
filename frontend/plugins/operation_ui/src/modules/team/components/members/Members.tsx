import { Button, Select, Skeleton, Table } from 'erxes-ui';
import { useParams } from 'react-router';
import { useGetTeamMembers } from '@/team/hooks/useGetTeamMembers';
import { MembersInline } from 'ui-modules';
import { AddMembers } from '@/team/components/members/AddMembers';
import { IconX } from '@tabler/icons-react';
import { useTeamMemberUpdate } from '@/team/hooks/useTeamMemberUpdate';
import { useTeamMemberRemove } from '@/team/hooks/useTeamMemberRemove';

export function Members() {
  const { id: teamId } = useParams();
  const { members, loading } = useGetTeamMembers({ teamId });
  const { updateTeamMember } = useTeamMemberUpdate();
  const { removeTeamMember } = useTeamMemberRemove();

  const roleHandler = (value: string, _id: string) => {
    updateTeamMember({
      variables: {
        _id,
        role: value,
      },
    });
  };

  const removeHandler = (_id: string) => {
    removeTeamMember({
      variables: {
        _id,
      },
    });
  };

  return (
    <div className="overflow-auto h-full">
      <div className="ml-auto flex justify-between px-8 py-6">
        <h1 className="text-xlfont-semibold">Members</h1>
        <AddMembers />
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head className="pl-8 w-auto">Member</Table.Head>
            <Table.Head className="w-52">Role</Table.Head>
            <Table.Head className="w-8" />
          </Table.Row>
        </Table.Header>
        <Table.Body className="px-8">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <MemberRowSkeleton key={index} />
              ))
            : members?.map((member) => (
                <Table.Row key={member._id} className="shadow-xs group">
                  <Table.Cell className="font-medium border-none pl-8 w-auto">
                    <MembersInline.Provider memberIds={[member.memberId]}>
                      <span className="w-full flex gap-2 items-center">
                        <span className="[1lh] flex items-center">
                          <MembersInline.Avatar />
                        </span>
                        <MembersInline.Title />
                      </span>
                    </MembersInline.Provider>
                  </Table.Cell>
                  <Table.Cell className="border-none px-2 w-52">
                    <Select
                      value={member.role}
                      onValueChange={(value) => roleHandler(value, member._id)}
                    >
                      <Select.Trigger className="w-full h-7 hover:bg-accent-foreground/10 shadow-none">
                        <Select.Value placeholder="Select role" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="admin">
                          <p className="text-xs">Admin</p>
                        </Select.Item>
                        <Select.Item value="lead">
                          <p className="text-xs">Lead</p>
                        </Select.Item>
                        <Select.Item value="member">
                          <p className="text-xs">Member</p>
                        </Select.Item>
                      </Select.Content>
                    </Select>
                  </Table.Cell>
                  <Table.Cell className="border-none w-8">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHandler(member._id)}
                      className="group-hover:flex hidden"
                    >
                      <IconX className="size-4" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
        </Table.Body>
      </Table>
    </div>
  );
}

const MemberRowSkeleton = () => {
  return (
    <Table.Row className="shadow-xs">
      <Table.Cell className="font-medium border-none pl-8 w-auto">
        <div className="flex gap-2 items-center">
          <Skeleton className="h-6 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </Table.Cell>
      <Table.Cell className="border-none px-2 w-52">
        <Skeleton className="h-7 w-full" />
      </Table.Cell>
      <Table.Cell className="border-none w-8">
        <Skeleton className="size-6" />
      </Table.Cell>
    </Table.Row>
  );
};
