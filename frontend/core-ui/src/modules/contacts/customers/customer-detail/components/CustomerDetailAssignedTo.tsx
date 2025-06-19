import { SelectMember } from 'ui-modules';
import { Label } from 'erxes-ui';
import { useState } from 'react';

export const CustomerDetailAssignedTo = ({ ownerId }: { ownerId: string }) => {
  const [_ownerId, setOwnerId] = useState(ownerId);
  return (
    <div className="px-8 space-y-2">
      <Label>Assigned To</Label>
      <div>
        <SelectMember
          value={_ownerId}
          onValueChange={(value) => setOwnerId(value as string)}
          className="min-w-60"
        />
      </div>
    </div>
  );
};
