import React from 'react';
import { FieldPath, useFormContext } from 'react-hook-form';
import { TUserDetailForm } from '../../types';
import { USER_LINK_FIELDS } from '../../constants/memberDetailFields';
import { LinkInput } from './fields/LinkInput';
import { Button, useQueryState } from 'erxes-ui';
import { useUserEdit } from '../../hooks/useUserEdit';

export const MemberLinks = () => {
  const { control, handleSubmit } = useFormContext<TUserDetailForm>();
  const { usersEdit } = useUserEdit();
  const [userId] = useQueryState<string>('user_id');

  const submitHandler = (data: TUserDetailForm) => {
    usersEdit(
      {
        variables: {
          _id: userId,
          links: { ...(data.links ?? {}) },
        },
      },
      ['links'],
    );
  };
  return (
    <form
      className="grid grid-cols-2 gap-3 w-full p-6"
      onSubmit={handleSubmit(submitHandler)}
    >
      {USER_LINK_FIELDS.map((field) => {
        const name = `${field.path}.${field.name}`;

        return (
          <LinkInput
            control={control}
            name={name as FieldPath<TUserDetailForm>}
            label={field.label}
            InputIcon={field.Icon}
          />
        );
      })}
      <span className="col-span-2 flex items-center">
        <Button className="w-1/6 ml-auto" type="submit">
          Update
        </Button>
      </span>
    </form>
  );
};
