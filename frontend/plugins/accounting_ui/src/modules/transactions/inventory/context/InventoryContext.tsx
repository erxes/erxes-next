import { createContext } from 'react';
import { IInventoryContext, IInventoryRowContext } from '../types/Inventory';

export const InventoryRowContext = createContext<IInventoryRowContext>(
  {} as IInventoryRowContext,
);

export const InventoryContext = createContext<IInventoryContext>(
  {} as IInventoryContext,
);
