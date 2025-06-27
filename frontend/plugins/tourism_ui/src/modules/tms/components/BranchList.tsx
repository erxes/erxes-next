import React, { useState } from 'react';
import {
  IconCalendarPlus,
  IconEdit,
  IconCopy,
  IconWorld,
  IconTrash,
  IconChevronDown,
} from '@tabler/icons-react';
import { useBranchList } from '@/tms/hooks/BranchList';
import { useBranchRemove } from '@/tms/hooks/BranchRemove';
import { useBranchDuplicate } from '@/tms/hooks/BranchDuplicate';
import { IBranch } from '@/tms/types/branch';
import { format } from 'date-fns';
import { EmptyList } from './EmptyList';
import { toast, Sheet, Popover, Button, Dialog } from 'erxes-ui';
import CreateTmsForm from './CreateTmsForm';

export const BranchList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { list, totalCount, pageInfo, loading, error, refetch } =
    useBranchList(currentPage);

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
          paymentTypes: branch.paymentTypes || [],
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

  if (loading) return <div className="p-3 w-full">Loading...</div>;
  if (error)
    return (
      <div className="p-3 w-full text-center">
        <p>Error loading branches</p>
        <p>{error.message}</p>
      </div>
    );
  if (!list || list.length === 0) return <EmptyList />;

  return (
    <>
      <div className="w-full p-3 flex flex-col min-h-[calc(100vh-200px)]">
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
            {list.map((branch: IBranch, index: number) => (
              <div
                key={branch._id}
                className="flex flex-col items-start p-2 w-full h-full bg-background shrink-0"
              >
                <div className="flex gap-4 items-start self-stretch">
                  <div className="flex flex-col items-start w-[290px] rounded-sm bg-background shadow-lg">
                    <div className="flex justify-between items-center self-stretch px-3 h-9">
                      <div className="flex gap-1 items-center">
                        <h3 className="text-sm font-semibold leading-[100%] text-foreground font-inter">
                          {branch.name || 'Unnamed Branch'}
                        </h3>
                      </div>

                      <Popover>
                        <Popover.Trigger asChild>
                          <button className="flex items-center leading-[100%] text-foreground font-inter gap-1 text-sm font-medium rounded-md px-1">
                            Action
                            <IconChevronDown size={18} stroke={2} />
                          </button>
                        </Popover.Trigger>
                        <Popover.Content
                          className="p-1 w-48 rounded-lg border shadow-lg bg-background"
                          side="bottom"
                          align="end"
                        >
                          <div
                            className="flex gap-3 items-center px-4 py-2 w-full text-left rounded-md cursor-pointer hover:bg-muted"
                            onClick={() => handleEditBranch(branch._id)}
                          >
                            <IconEdit size={16} stroke={1.5} />
                            <p className="text-sm font-medium leading-[100%] font-inter">
                              Edit
                            </p>
                          </div>

                          <div
                            className={`flex items-center w-full gap-3 px-4 py-2 text-left cursor-pointer hover:bg-muted rounded-md ${
                              duplicateLoading
                                ? 'opacity-50 pointer-events-none'
                                : ''}`}
                            onClick={() =>
                              !duplicateLoading &&
                              setDuplicateDialogOpen(branch._id)
                            }
                          >
                            <IconCopy size={16} stroke={1.5} />
                            <p className="text-sm font-medium leading-[100%] font-inter">
                              {duplicateLoading
                                ? 'Duplicating...'
                                : 'Duplicate'}
                            </p>
                          </div>

                          <div
                            className="flex gap-3 items-center px-4 py-2 w-full text-left rounded-md cursor-pointer hover:bg-muted"
                            onClick={() => {
                              window.open(
                                branch.uiOptions?.url ||
                                  'https://tourism.tms.erxes.io',
                                '_blank',
                              );
                            }}
                          >
                            <IconWorld size={16} stroke={1.5} />
                            <p className="text-sm font-medium leading-[100%] font-inter">
                              Visit website
                            </p>
                          </div>

                          <div
                            className="flex gap-3 items-center px-4 py-2 w-full text-left rounded-md cursor-pointer hover:bg-destructive/10 text-destructive"
                            onClick={() => setDeleteDialogOpen(branch._id)}
                          >
                            <IconTrash size={16} stroke={1.5} />
                            <p className="text-sm font-medium leading-[100%] font-inter">
                              Delete
                            </p>
                          </div>
                        </Popover.Content>
                      </Popover>
                    </div>

                    <div className="flex h-[150px] w-full flex-col items-start gap-3 self-stretch">
                      <div className="flex justify-center items-center w-full h-full bg-background">
                        <img
                          src={
                            branch.uiOptions?.logo ||
                            'https://placehold.co/150x150'
                          }
                          alt={branch.name || 'Branch logo'}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center self-stretch px-3 h-9">
                      <div className="flex gap-2 items-center">
                        <IconCalendarPlus
                          size={12}
                          className="text-foreground"
                        />
                        <span className="text-[12px] font-semibold leading-[100%] font-inter">
                          Created:{' '}
                          {branch.createdAt
                            ? format(new Date(branch.createdAt), 'dd MMM yyyy')
                            : 'N/A'}
                        </span>
                      </div>

                      {branch.user?.details?.avatar && (
                        <img
                          src={branch.user.details.avatar}
                          alt={branch.user.details.fullName || 'User avatar'}
                          className="w-6 h-6 rounded-full border shadow-sm"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="flex sticky bottom-0 justify-between items-center py-4 mt-4 border-t bg-background">
        <div className="text-sm text-gray-500">
          Showing {list.length} of {totalCount} branches
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={!pageInfo?.hasPreviousPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={!pageInfo?.hasNextPage}
          >
            Next
          </Button>
        </div>
      </div> */}
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

      {/* duplicate */}
      <Dialog
        open={!!duplicateDialogOpen}
        onOpenChange={(open) => !open && setDuplicateDialogOpen(null)}
      >
        <Dialog.Content className="sm:max-w-md">
          <Dialog.Header>
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-orange-100 rounded-full">
                <IconCopy size={20} className="text-orange-600" />
              </div>
              <Dialog.Title className="text-lg font-bold">
                Duplicate Branch
              </Dialog.Title>
            </div>
          </Dialog.Header>
          <div className="space-y-4">
            <div className="p-3 rounded-lg border shadow-sm bg-background">
              <p className="text-sm font-medium text-foreground">
                This will create a new branch with copied settings
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to create a duplicate of{' '}
              <strong className="text-foreground">
                "{list?.find((b) => b._id === duplicateDialogOpen)?.name}"
              </strong>
              ? A new branch will be created with all the same configurations.
            </p>
          </div>
          <Dialog.Footer>
            <Button
              variant="outline"
              onClick={() => setDuplicateDialogOpen(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                const branch = list?.find((b) => b._id === duplicateDialogOpen);
                if (branch) handleDuplicateBranch(branch);
              }}
              disabled={duplicateLoading}
              className="text-white bg-orange-600 hover:bg-orange-700"
            >
              {duplicateLoading ? 'Duplicating...' : 'Yes, Duplicate'}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>

      {/* delete */}
      <Dialog
        open={!!deleteDialogOpen}
        onOpenChange={(open) => !open && setDeleteDialogOpen(null)}
      >
        <Dialog.Content className="sm:max-w-md">
          <Dialog.Header>
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-red-100 rounded-full">
                <IconTrash size={20} className="text-red-600" />
              </div>
              <Dialog.Title className="text-lg font-bold">
                Delete Branch
              </Dialog.Title>
            </div>
          </Dialog.Header>
          <div className="space-y-4">
            <div className="p-3 rounded-lg border shadow-sm bg-background">
              <p className="text-sm font-medium text-foreground">
                Warning: This action cannot be undone
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to permanently delete{' '}
              <strong className="text-foreground">
                "{list?.find((b) => b._id === deleteDialogOpen)?.name}"
              </strong>
              ? All associated data will be lost forever.
            </p>
          </div>
          <Dialog.Footer>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteDialogOpen) handleDeleteBranch(deleteDialogOpen);
              }}
              disabled={removeLoading}
            >
              {removeLoading ? 'Deleting...' : 'Yes, Delete Forever'}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </>
  );
};
