import { useContext } from 'react';
import {
  InventoryContext,
  InventoryRowContext,
} from '../context/InventoryContext';

export const useInventoryContext = () => {
  return useContext(InventoryContext);
};

export const useInventoryRowContext = () => {
  return useContext(InventoryRowContext);
};
