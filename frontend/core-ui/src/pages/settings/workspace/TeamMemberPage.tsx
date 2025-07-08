import { TeamMember } from '@/settings/team-member/components/TeamMember';
import { PageContainer, useQueryState } from 'erxes-ui';
import { MemberDetail } from '@/settings/team-member/details/components/MemberDetail';

export function TeamMemberPage() {
  const [userId] = useQueryState('user_id');
  return (
    <PageContainer>
      <TeamMember />
      {!!userId && <MemberDetail />}
    </PageContainer>
  );
}
