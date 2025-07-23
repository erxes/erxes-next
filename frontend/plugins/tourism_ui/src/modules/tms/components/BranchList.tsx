import { useState } from 'react';
import { useBranchList } from '@/tms/hooks/BranchList';
import { useBranchRemove } from '@/tms/hooks/BranchRemove';
import { useBranchDuplicate } from '@/tms/hooks/BranchDuplicate';
import { IBranch } from '@/tms/types/branch';
import { EmptyList } from './EmptyList';
import { BranchCard } from './BranchCard';
import { ConfirmationDialog } from './ConfirmationDialog';
import { toast, Sheet, Spinner } from 'erxes-ui';
import CreateTmsForm from './CreateTmsForm';

export const BranchList = () => {
  const { list, loading, error, refetch } = useBranchList();

  const { removeBranchById, loading: removeLoading } = useBranchRemove();
  const { duplicateBranch, loading: duplicateLoading } = useBranchDuplicate();

  const [editingBranch, setEditingBranch] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState<string | null>(
    null,
  );

  const handleEditBranch = (branchId: string) => {
    setEditingBranch(branchId);
  };

  const handleDuplicateBranch = async (branch: IBranch) => {
    setDuplicateDialogOpen(null);

    try {
      await duplicateBranch({
        variables: {
          name: `${branch.name} (Copy)`,
          description: branch.description,
          generalManagerIds: branch.generalManagerIds || [],
          managerIds: branch.managerIds || [],
          paymentIds: branch.paymentIds || [],
          paymentTypes: (branch.paymentTypes || []).map((name) => ({
            id: name,
            name: name,
          })),
          erxesAppToken: branch.erxesAppToken,
          permissionConfig: branch.permissionConfig || [],
          uiOptions: branch.uiOptions || {},
        },
        onCompleted: async () => {
          toast({
            title: 'Branch duplicated successfully',
          });
          await refetch();
        },
        onError: (error) => {
          toast({
            title: 'Failed to duplicate branch',
            description: error.message,
            variant: 'destructive',
          });
        },
      });
    } catch (error) {
      toast({
        title: 'Failed to duplicate branch',
        description: error?.message || 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    setDeleteDialogOpen(null);

    try {
      const success = await removeBranchById(branchId);

      if (success) {
        toast({
          title: 'Branch deleted successfully',
        });
        await refetch();
      } else {
        toast({
          title: 'Failed to delete branch',
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to delete branch',
        description: `${error.message}`,
      });
    }
  };

  if (loading) return <Spinner />;

  if (error)
    return (
      <div className="text-destructive">
        Error loading branches: {error.message}
      </div>
    );

  if (!list || list.length === 0) return <EmptyList />;

  return (
    <>
      <div className="w-full p-3 flex flex-col min-h-[calc(100vh-200px)]">
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
            {list.map((branch: IBranch) => (
              <BranchCard
                key={branch._id}
                branch={branch}
                onEdit={handleEditBranch}
                onDuplicate={setDuplicateDialogOpen}
                onDelete={setDeleteDialogOpen}
                duplicateLoading={duplicateLoading}
              />
            ))}
          </div>
        </div>
      </div>

      <Sheet
        open={!!editingBranch}
        onOpenChange={(open) => {
          if (!open) {
            setEditingBranch(null);
          }
        }}
      >
        <Sheet.View
          className="p-0 sm:max-w-8xl"
          onEscapeKeyDown={(e) => {
            e.preventDefault();
          }}
        >
          {editingBranch && (
            <CreateTmsForm
              branchId={editingBranch}
              onOpenChange={(open) => {
                if (!open) {
                  setEditingBranch(null);
                }
              }}
              onSuccess={() => {
                setEditingBranch(null);
              }}
              refetch={refetch}
            />
          )}
        </Sheet.View>
      </Sheet>

      <ConfirmationDialog
        open={!!duplicateDialogOpen}
        onOpenChange={(open) => !open && setDuplicateDialogOpen(null)}
        type="duplicate"
        branchName={list?.find((b) => b._id === duplicateDialogOpen)?.name || ''}
        loading={duplicateLoading}
        onConfirm={() => {
          const branch = list?.find((b) => b._id === duplicateDialogOpen);
          if (branch) handleDuplicateBranch(branch);
        }}
      />

      <ConfirmationDialog
        open={!!deleteDialogOpen}
        onOpenChange={(open) => !open && setDeleteDialogOpen(null)}
        type="delete"
        branchName={list?.find((b) => b._id === deleteDialogOpen)?.name || ''}
        loading={removeLoading}
        onConfirm={() => {
          if (deleteDialogOpen) handleDeleteBranch(deleteDialogOpen);
        }}
      />
    </>
  );
};
