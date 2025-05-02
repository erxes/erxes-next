export type IUIConfig = {
  name: string;
  icon: React.ElementType;
  modules: {
    name: string;
    icon: React.ElementType;
    path: string;
    hasSettings: boolean;
    haveWidgets: boolean;
    submenus?: {
      name: string;
      path: string;
    }[];
  }[];
};
