export type IUIConfig = {
  name: string;
  icon?: React.ElementType;
  navigationGroup?: {
    name: string;
    icon: React.ElementType;
    content: () => React.ReactNode;
    actions?: () => React.ReactNode;
    subGroups?: {
      name: string;
      content: () => React.ReactNode;
    }[];
  };
  modules: {
    name: string;
    icon?: React.ElementType;
    path: string;
    hasSettings?: boolean;
    hasRelationWidget?: boolean;
    hasFloatingWidget?: boolean;
    settingsOnly?: boolean;
    submenus?: {
      name: string;
      path: string;
      icon?: React.ElementType;
    }[];
  }[];
};
