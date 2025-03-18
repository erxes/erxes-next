import { useContext } from 'react';
import { MemberInlineContext } from '../contexts/MemberInlineContext';
import { IMember } from '../types/TeamMembers';

export const useMemberInlineContext = () => {
  const memberInline = useContext(MemberInlineContext);
  return (
    memberInline ||
    ({} as IMember['details'] & { loading: boolean; _id: string })
  );
};
