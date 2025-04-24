export type UIConfig = {
  name: string;
  icon: React.ElementType;
  modules: {
    name: string;
    icon: React.ElementType;
    path: string;
    hasSettings: boolean;
    submenus?: {
      name: string;
      path: string;
    }[];
  }[];
};
