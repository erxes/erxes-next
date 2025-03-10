export interface ISelectTreeContext {
  id: string;
  hideChildren: string[];
  setHideChildren: (hideChildren: string[]) => void;
  ordered?: boolean;
}
