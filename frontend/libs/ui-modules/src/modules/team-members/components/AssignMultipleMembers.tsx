import React, { useState } from 'react';
import { ButtonProps, Combobox, Popover } from 'erxes-ui';
import { AssignMemberItem, AssignMemberList } from './AssignMember';
import { IMember } from '../types/TeamMembers';
import { MemberListInline } from './MemberListInline';

interface AssignMultipleMembersProps {
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

export const AssignMultipleMembers = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  ButtonProps & AssignMultipleMembersProps
>(({ value, onValueChange, children, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<IMember[]>([]);

  const isSelected = (member: IMember) =>
    selectedMembers.some((m) => m._id === member._id);

  const handleSelect = (member?: IMember) => {
    if (!member) return;

    const newSelectedMembers = isSelected(member)
      ? selectedMembers.filter((m) => m._id !== member._id)
      : [...selectedMembers, member];

    setSelectedMembers(newSelectedMembers);
    onValueChange?.(newSelectedMembers.map((m) => m._id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      {children ? (
        children
      ) : (
        <Combobox.Trigger ref={ref} {...props}>
          <MemberListInline members={selectedMembers} memberIds={value} />
        </Combobox.Trigger>
      )}
      <Combobox.Content>
        <AssignMemberList
          sort={!open}
          renderItem={(user) => (
            <AssignMemberItem
              key={user._id}
              user={user}
              isSelected={isSelected(user)}
              handleSelect={handleSelect}
            />
          )}
        />
      </Combobox.Content>
    </Popover>
  );
});
