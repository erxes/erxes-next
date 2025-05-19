import { Sheet } from 'erxes-ui';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

export const BranchEdit = ({ children }: { children?: React.ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const branchId = searchParams.get('branch_id');

  const setOpen = (newBranchId: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (newBranchId) {
      newSearchParams.set('branch_id', newBranchId);
    } else {
      newSearchParams.delete('branch_id');
    }
    setSearchParams(newSearchParams);
  };
  return (
    <Sheet
      open={!!branchId}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setOpen(null);
        }
      }}
    >
      <Sheet.View className="p-0">
        <Sheet.Header>
          <Sheet.Title>Title</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <Sheet.Content>Sheet</Sheet.Content>
        <Sheet.Footer>Footer</Sheet.Footer>
      </Sheet.View>
    </Sheet>
  );
};
