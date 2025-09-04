export type IUIConfig = {
  name: string;
  icon?: React.ElementType;
  navigationGroup?: {
    name: string;
    icon: React.ElementType;
    content: () => React.ReactNode;
    subGroups?: () => React.ReactNode;
  };
  modules: {
    name: string;
    icon?: React.ElementType;
    path: string;
    hasSettings?: boolean;
    hasRelationWidget?: boolean;
    hasFloatingWidget?: boolean;
    settingsOnly?: boolean;
  }[];

  relationWidgets?: {
    name: string;
    icon?: React.ElementType;
  }[];
};
