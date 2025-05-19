import React from 'react';
import { CreateBranch } from './CreateBranch';
import { BranchFilter } from './BranchFilter';

export const BranchesTopbar = () => {
  return (
    <div className="ml-auto flex items-center gap-3">
      <BranchFilter />
      <CreateBranch />
    </div>
  );
};
