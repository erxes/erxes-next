import { createContext, useContext } from 'react';

export const WidgetContext = createContext<{
  Widget: () => JSX.Element | null;
}>(
  {} as {
    Widget: () => JSX.Element | null;
  },
);

export const WidgetProvider = ({
  children,
  Widget,
}: {
  children: React.ReactNode;
  Widget: () => JSX.Element | null;
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
