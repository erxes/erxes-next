import { AssignMember } from 'ui-modules';
import { Label } from 'erxes-ui';
import { useState } from 'react';

export const CustomerDetailAssignedTo = ({ ownerId }: { ownerId: string }) => {
  const [_ownerId, setOwnerId] = useState(ownerId);
  return (
    <div className="px-8 space-y-2">
      <Label>Assigned To</Label>
      <div>
        <AssignMember
          value={_ownerId}
          onValueChange={setOwnerId}
          className="min-w-60"
          variant="ghost"
          size="lg"
        />
      </div>
    </div>
  );
};
