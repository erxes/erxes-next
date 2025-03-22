import { z } from 'zod';
import { addAccountSchema } from '../constants/addAccountSchema';

export type TAddAccountForm = z.infer<typeof addAccountSchema>;
