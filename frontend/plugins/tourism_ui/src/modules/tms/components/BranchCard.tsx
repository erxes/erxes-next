import { IconCalendarPlus } from '@tabler/icons-react';
import { IBranch } from '@/tms/types/branch';
import { format } from 'date-fns';
import { Avatar } from 'erxes-ui';
import { readImage } from 'erxes-ui/utils/core';
import { ActionMenu } from './ActionMenu';

interface BranchCardProps {
  branch: IBranch;
  onEdit: (branchId: string) => void;
  onDuplicate: (branchId: string) => void;
  onDelete: (branchId: string) => void;
  duplicateLoading: boolean;
}

export const BranchCard = ({
  branch,
  onEdit,
  onDuplicate,
  onDelete,
  duplicateLoading,
}: BranchCardProps) => {
  return (
    <div className="flex flex-col items-start p-2 w-full h-full bg-background shrink-0">
      <div className="flex gap-4 items-start self-stretch">
        <div className="flex flex-col items-start w-[290px] rounded-sm bg-background shadow-lg">
          <div className="flex justify-between items-center self-stretch px-3 h-9">
            <div className="flex gap-1 items-center">
              <h3 className="text-sm font-semibold leading-[100%] text-foreground font-inter">
                {branch.name || 'Unnamed Branch'}
              </h3>
            </div>

            <ActionMenu
              onEdit={() => onEdit(branch._id)}
              onDuplicate={() => onDuplicate(branch._id)}
              onDelete={() => onDelete(branch._id)}
              duplicateLoading={duplicateLoading}
            />
          </div>

          <div className="flex h-[150px] w-full flex-col items-start gap-3 self-stretch">
            <div className="flex justify-center items-center w-full h-full bg-background">
              <img
                src={
                  branch.uiOptions?.logo
                    ? readImage(branch.uiOptions.logo)
                    : 'https://placehold.co/150x150'
                }
                alt={branch.name || 'Branch logo'}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <div className="flex justify-between items-center self-stretch px-3 h-9">
            <div className="flex gap-2 items-center">
              <IconCalendarPlus size={12} className="text-foreground" />
              <span className="text-[12px] font-semibold leading-[100%] font-inter">
                Created:{' '}
                {branch.createdAt
                  ? format(new Date(branch.createdAt), 'dd MMM yyyy')
                  : 'N/A'}
              </span>
            </div>

            <Avatar className="w-6 h-6 rounded-full border shadow-sm">
              {branch.user?.details?.avatar ? (
                <Avatar.Image
                  src={branch.user.details.avatar}
                  alt={branch.user.details.fullName || 'User avatar'}
                />
              ) : null}
              <Avatar.Fallback>
                {branch.user?.details?.fullName
                  ?.split(' ')[0]
                  ?.charAt(0)
                  ?.toUpperCase() || 'A'}
              </Avatar.Fallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
};
