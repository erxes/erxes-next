// context/DealsContext.tsx
import { ReactNode, createContext, useContext, useMemo } from 'react';
import {
  useDealsAdd,
  useDealsEdit,
  useDealsRemove,
} from '../cards/hooks/useDeals';

interface DealsContextType {
  addDeals: ReturnType<typeof useDealsAdd>['addDeals'];
  editDeals: ReturnType<typeof useDealsEdit>['editDeals'];
  removeDeals: ReturnType<typeof useDealsRemove>['removeDeals'];
  loading: boolean;
  error: any;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

export const DealsProvider = ({ children }: { children: ReactNode }) => {
  const { addDeals, loading: loadingAdd, error: errorAdd } = useDealsAdd();
  const { editDeals, loading: loadingEdit, error: errorEdit } = useDealsEdit();
  const {
    removeDeals,
    loading: loadingRemove,
    error: errorRemove,
  } = useDealsRemove();

  const loading = loadingAdd || loadingEdit || loadingRemove;
  const error = errorAdd || errorEdit || errorRemove;

  const value = useMemo(
    () => ({ addDeals, editDeals, removeDeals, loading, error }),
    [addDeals, editDeals, removeDeals, loading, error],
  );

  return (
    <DealsContext.Provider value={value}>{children}</DealsContext.Provider>
  );
};

export const useDealsContext = () => {
  const context = useContext(DealsContext);
  if (!context) {
    throw new Error('useDealsContext must be used within a DealsProvider');
  }
  return context;
};
