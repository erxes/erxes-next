import { TextInputField } from './fields/TextInputField';
import { USER_DETAIL_FIELDS } from '../../constants/memberDetailFields';
import { FieldPath, useFormContext } from 'react-hook-form';
import { TUserDetailForm } from '../../types';
import { Button, useQueryState } from 'erxes-ui';
import { useUserEdit } from '../../hooks/useUserEdit';

export const MemberForm = () => {
  const { control, handleSubmit } = useFormContext<TUserDetailForm>();
  const { usersEdit } = useUserEdit();
  const [userId] = useQueryState<string>('user_id');

  const onSubmit = (data: TUserDetailForm) => {
    usersEdit(
      {
        variables: {
          _id: userId,
          ...data,
        },
      },
      Object.keys(data).map((key) => `${key}`),
    );
  };

  return (
    <form
      className="grid grid-cols-6 gap-3 w-full p-6 auto-rows-fr"
      onSubmit={handleSubmit(onSubmit)}
    >
      {USER_DETAIL_FIELDS.map((field) => {
        const name = field.path ? `${field.path}.${field.name}` : field.name;
        return (
          <TextInputField
            control={control}
            key={field.name}
            name={name as FieldPath<TUserDetailForm>}
            label={field.label}
            description={field.description ?? field.label}
            type={field.attributeType}
            placeholder={field.placeholder}
          />
        );
      })}
      <span className="col-span-6 flex items-center row-start-8">
        <Button className="w-1/6 ml-auto" type="submit">
          Update
        </Button>
      </span>
    </form>
  );
};
