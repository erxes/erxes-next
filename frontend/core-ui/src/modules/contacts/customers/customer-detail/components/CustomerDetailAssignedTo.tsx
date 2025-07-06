import { SelectMember } from 'ui-modules';
import { Label } from 'erxes-ui';
import { useState } from 'react';

export const CustomerDetailAssignedTo = ({
  ownerId,
}: {
  ownerId: string | undefined;
}) => {
  const [_ownerId, setOwnerId] = useState(ownerId);
  if (!_ownerId) {
    return;
  }
  return (
    <div className="px-8 space-y-2">
      <Label>Owner</Label>
      <div>
        <SelectMember.Detail
          value={_ownerId}
          onValueChange={(value) => setOwnerId(value as string)}
        />
      </div>
    </div>
  );
};
