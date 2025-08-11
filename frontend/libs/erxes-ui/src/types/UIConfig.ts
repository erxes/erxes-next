export type IUIConfig = {
  name: string;
  icon?: React.ElementType;
  navigationGroup?: {
    name: string;
    icon: React.ElementType;
    content: () => React.ReactNode;
    actions?: () => React.ReactNode;
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
};
