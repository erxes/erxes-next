import { useCustomerEdit } from 'ui-modules/modules/contacts/hooks';
import { SelectMember } from 'ui-modules/modules/team-members';

export const CustomerOwner = ({
  _id,
  ownerId,
  inTable = false,
}: {
  _id: string;
  ownerId?: string;
  inTable?: boolean;
}) => {
  const { customerEdit } = useCustomerEdit();

  const SelectComponent = inTable ? SelectMember.InlineCell : SelectMember;

  return (
    <SelectComponent
      mode="single"
      value={ownerId}
      size="lg"
      onValueChange={(value) => {
        customerEdit({
          variables: {
            _id,
            ownerId: value,
          },
        });
      }}
    />
  );
};
