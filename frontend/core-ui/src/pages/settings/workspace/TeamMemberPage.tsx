import { TeamMember } from '@/settings/team-member/components/TeamMember';
import { useQueryState } from 'erxes-ui/hooks';
import { MemberDetail } from '@/settings/team-member/details/components/MemberDetail';
import { PageContainer } from 'erxes-ui';

export function TeamMemberPage() {
  const [userId] = useQueryState('user_id');
  return (
    <PageContainer>
      <TeamMember />
      {!!userId && <MemberDetail />}
    </PageContainer>
  );
}
