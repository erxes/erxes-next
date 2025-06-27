import { IMember } from 'ui-modules/modules/team-members/types/TeamMembers';

import { atom } from 'jotai';

export const currentUserState = atom<IMember | null>(null);
