export interface IBranch {
  _id: string;
  title: string;
  code: string;
  parentId: string;
}

export interface IBranchContext {
  selectedBranch: IBranch | undefined;
  setSelectedBranch: (branch: IBranch) => void;
}
