import { TeamMember } from '@/settings/team-member/components/TeamMember';
import { useQueryState } from 'erxes-ui/hooks';
import { MemberDetail } from '@/settings/team-member/details/components/MemberDetail';

export function TeamMemberPage() {
  const [userId] = useQueryState('user_id');
  return (
    <section className="mx-auto flex w-full h-screen relative">
      <TeamMember />
      {!!userId && <MemberDetail />}
    </section>
  );
}
