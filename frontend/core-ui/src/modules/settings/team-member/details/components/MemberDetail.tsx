import { Separator } from 'erxes-ui';
import {
  MemberDetailLayout,
  MemberDetailTabContent,
} from '@/settings/team-member/details/components/MemberDetailLayout';
import { MemberForm } from '@/settings/team-member/details/components/MemberForm';
import { MemberLinks } from '@/settings/team-member/details/components/MemberLinks';

export function MemberDetail() {
  return (
    <MemberDetailLayout>
      <MemberDetailTabContent value="general">
        <MemberForm />
      </MemberDetailTabContent>
      <MemberDetailTabContent value="links">
        <MemberLinks />
      </MemberDetailTabContent>
    </MemberDetailLayout>
  );
}
