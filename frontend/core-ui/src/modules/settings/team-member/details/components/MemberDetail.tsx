import { Separator } from 'erxes-ui';
import {
  MemberDetailLayout,
  MemberDetailTabContent,
} from '@/settings/team-member/details/components/MemberDetailLayout';
import { MemberForm } from '@/settings/team-member/details/components/MemberForm';
import { MemberLinks } from '@/settings/team-member/details/components/MemberLinks';
import { MemberOther } from '@/settings/team-member/details/components/MemberOther';

export function MemberDetail() {
  return (
    <MemberDetailLayout>
      <Separator />
      <MemberDetailTabContent value="general">
        <MemberForm />
      </MemberDetailTabContent>
      <MemberDetailTabContent value="links">
        <MemberLinks />
      </MemberDetailTabContent>
      <MemberDetailTabContent value="other">
        <MemberOther />
      </MemberDetailTabContent>
    </MemberDetailLayout>
  );
}
