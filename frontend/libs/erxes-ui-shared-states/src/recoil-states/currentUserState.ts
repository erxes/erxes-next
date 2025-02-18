import { atom } from 'jotai';

export type CurrentUser = {
  _id: string;
  email: string;
  username: string;
  details: {
    avatar: string;
    fullName: string;
  };
};

export const currentUserState = atom<CurrentUser | null>(null);
