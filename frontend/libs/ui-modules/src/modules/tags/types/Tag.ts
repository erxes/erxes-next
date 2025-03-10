export interface ITag {
  _id: string;
  name: string;
  colorCode?: string;
  parentId?: string;
  order: string;
}

export type ISelectTagsContextProviderProps = {
  tagType: string;
  selected?: string[];
  onSelect?: (tags: string[]) => void;
  loading?: boolean;
  children: React.ReactNode;
  asTrigger?: boolean;
};

export interface ISelectTagsContext {
  tagType: string;
  selected: string[];
  selectedTags?: ITag[];
  onSelect: (tags: ITag) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  asTrigger?: boolean;
  loading?: boolean;
}

export interface SelectTagFetchMoreProps {
  fetchMore: () => void;
  tagsLength: number;
  totalCount: number;
}

export interface SelectTagsProps {
  tagType: string;
  selected?: string[];
  onSelect?: (tags: string[]) => void;
  loading?: boolean;
  recordId: string;
  fieldId?: string;
  showAddButton?: boolean;
  asTrigger?: boolean;
  display?: () => React.ReactNode;
  inDetail?: boolean;
}

export interface TagBadgesProps {
  tagIds?: string[];
  tags?: ITag[];
}
