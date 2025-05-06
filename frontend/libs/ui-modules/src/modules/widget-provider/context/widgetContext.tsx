import { createContext, useContext } from 'react';

export type WidgetProps = {
  contentType: string;
  contentId: string;
};

export const WidgetContext = createContext<{
  Widget: (props: WidgetProps) => JSX.Element | null;
}>(
  {} as {
    Widget: (props: any) => JSX.Element | null;
  },
);

export const WidgetProvider = ({
  children,
  Widget,
}: {
  children: React.ReactNode;
  Widget: (props: WidgetProps) => JSX.Element | null;
}) => {
  return (
    <WidgetContext.Provider value={{ Widget }}>
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidget = () => {
  return useContext(WidgetContext);
};
