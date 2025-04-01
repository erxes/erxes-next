import { Journal } from '../type/Account';
import { CurrencyCode } from 'erxes-ui';
import { AccountKind } from '../type/Account';
import { TAccountForm } from '../type/accountForm';

export const ACCOUNT_DEFAULT_VALUES: TAccountForm = {
  name: '',
  code: '',
  categoryId: '',
  description: '',
  currency: CurrencyCode.USD,
  kind: AccountKind.ACTIVE,
  journal: Journal.MAIN,
  branchId: '',
  departmentId: '',
  isTemp: false,
  isOutBalance: false,
};
