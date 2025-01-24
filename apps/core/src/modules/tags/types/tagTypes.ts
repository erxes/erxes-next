export interface ITag {
  _id: string;
  name: string;
  colorCode?: string;
  parentId?: string;
  order: string;
}

export interface ISelectTagsContext {
  tagType?: string;
  selectedTagIds: string[];
  selectedTags: ITag[];
  setSelectedTags: (tags: ITag[]) => void;
  handleSelect: (tag: ITag) => void;
  openCreateTag: () => void;
  sub?: boolean;
}

export interface SelectTagFetchMoreProps {
  fetchMore: () => void;
  tagsLength: number;
  totalCount: number;
}

export interface SelectTagsProps {
  tagType?: string;
  sub?: boolean;
  single?: boolean;
  selected?: string[] | string;
  onSelect?: (tags: string[] | string) => void;
  className?: string;
}
