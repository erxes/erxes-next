import React, { createContext, useContext, useState, ReactNode } from 'react';

type CmsContextType = {
  selectedWebsite: string | null;
  setSelectedWebsite: (website: string) => void;
};

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider = ({ children }: { children: ReactNode }) => {
  const [selectedWebsite, setSelectedWebsite] = useState<string | null>(null);

  return (
    <CmsContext.Provider
      value={{
        selectedWebsite,
        setSelectedWebsite,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCmsContext = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCmsContext must be used within a CmsProvider');
  }
  return context;
};
