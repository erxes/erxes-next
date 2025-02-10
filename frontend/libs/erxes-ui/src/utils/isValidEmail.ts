import { emailRegex } from './regex';

export const isValidEmail = (email: string) => {
  return emailRegex.test(email);
};
