import { IUIConfig } from 'erxes-ui';
import { createContext, useContext } from 'react';

export type WidgetProps = {
  module: IUIConfig['modules'][number] & {
    pluginName: string;
  };
};

export const WidgetContext = createContext<{
  Widget: (props: WidgetProps) => JSX.Element | null;
  widgetsModules: (IUIConfig['modules'][number] & { pluginName: string })[];
}>(
  {} as {
    Widget: (props: any) => JSX.Element | null;
    widgetsModules: (IUIConfig['modules'][number] & { pluginName: string })[];
  },
);

export const WidgetProvider = ({
  children,
  Widget,
  widgetsModules,
}: {
  children: React.ReactNode;
  Widget: (props: WidgetProps) => JSX.Element | null;
  widgetsModules: (IUIConfig['modules'][number] & { pluginName: string })[];
}) => {
  return (
    <WidgetContext.Provider value={{ Widget, widgetsModules }}>
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidget = () => {
  return useContext(WidgetContext);
};
