import { IUser } from '../types/TeamMembers';
import { MemberInlineContext } from '../contexts/MemberInlineContext';
import { useContext } from 'react';

export const useMemberInlineContext = () => {
  const memberInline = useContext(MemberInlineContext);
  return (
    memberInline || ({} as IUser['details'] & { loading: boolean; _id: string })
  );
};
