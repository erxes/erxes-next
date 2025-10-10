import { useLocation } from 'react-router';
import { LEADS_CURSOR_SESSION_KEY, POS_CURSOR_SESSION_KEY } from '~/modules/pos/constants/PosCursorSessionKey';

import { PosPath } from '~/modules/pos/types/path/PosPath';
  

export const useIsPosLeadSessionKey = () => {
  const { pathname } = useLocation();
  const isLead = new RegExp(`(^|/)${PosPath.Leads}(/|$)`).test(pathname);
  return {
    isLead,
    sessionKey: isLead
      ? LEADS_CURSOR_SESSION_KEY
      : POS_CURSOR_SESSION_KEY,
  };
};
