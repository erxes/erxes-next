import { JournalEnum } from '@/settings/account/types/Account';
import {
  ITransactionGroupForm,
  TInventoryProduct,
} from '../../transactionForm/types/AddTransaction';

export interface IInventoryContext {
  selectedProducts: string[];
  setSelectedProducts: (selectedProducts: string[]) => void;
  journalIndex: number;
  journal: JournalEnum;
  inventoriesLength: number;
  form: ITransactionGroupForm;
  fields: TInventoryProduct & { id: string }[];
}

export interface IInventoryRowContext {
  productIndex: number;
  product: TInventoryProduct & { id: string };
}
