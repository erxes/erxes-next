import { useFormContext } from 'react-hook-form';
import { Form, Input, Textarea } from 'erxes-ui';

import { TTeamForm } from '@/team/types';

export const CreateTeamForm = () => {
  const form = useFormContext<TTeamForm>();

  console.log(form);

  return (
    <div className="flex flex-col gap-3">
      <Form.Field
        control={form.control}
        name="name"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Team name</Form.Label>
            <Form.Description className="sr-only">Team Name</Form.Description>
            <Form.Control>
              <Input {...field} />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
      <Form.Field
        control={form.control}
        name="description"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>description</Form.Label>
            <Form.Description className="sr-only">description</Form.Description>
            <Form.Control>
              <Textarea {...field} />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
    </div>
  );
};
