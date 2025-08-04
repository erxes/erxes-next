import { Form } from 'erxes-ui';
import { SelectMember } from 'ui-modules';
import { UseFormReturn } from 'react-hook-form';

import { TTeamMemberForm } from '@/team/types';

export const MemberForm = ({
  form,
}: {
  form: UseFormReturn<TTeamMemberForm>;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <Form.Field
        control={form.control}
        name="memberIds"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Choose members</Form.Label>
            <Form.Description className="sr-only">Members</Form.Description>
            <Form.Control>
              <SelectMember.Provider>
                <SelectMember.FormItem
                  mode="multiple"
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </SelectMember.Provider>
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
    </div>
  );
};
