import React from 'react';
import { useFormContext } from 'react-hook-form';
import { TUserDetailForm } from '../../types';
import { Form } from 'erxes-ui';
import { MultipleSelectChannels } from 'ui-modules';

export const MemberOther = () => {
  const { control, watch } = useFormContext<TUserDetailForm>();
  console.log(watch(), 'sd')
  return (
    <form className="grid grid-cols-2 gap-3 max-w-xl mx-auto p-6">
      <Form.Field
        control={control}
        name="channelIds"
        render={({ field }) => (
          <Form.Item className='col-span-2'>
            <Form.Label>Choose the channels</Form.Label>
            <Form.Control>
              <MultipleSelectChannels
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
              />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        )}
      />
    </form>
  );
};
