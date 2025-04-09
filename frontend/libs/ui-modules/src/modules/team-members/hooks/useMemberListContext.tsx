import { useContext } from 'react';
import { MemberListInlineContext } from '../contexts/MemberListInlineContext';

export const useMemberListContext = () => {
  return useContext(MemberListInlineContext);
};
