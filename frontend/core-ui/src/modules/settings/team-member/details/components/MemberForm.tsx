import { TextInputField } from './fields/TextInputField';
import { USER_DETAIL_FIELDS } from '../../constants/memberDetailFields';
import { FieldPath, useFormContext } from 'react-hook-form';
import { TUserDetailForm } from '../../types';
import { Button } from 'erxes-ui';

export const MemberForm = () => {
  const { control } = useFormContext<TUserDetailForm>();

  return (
    <form className="grid grid-cols-2 gap-3 w-full p-6 auto-rows-fr">
      {USER_DETAIL_FIELDS.map((field) => {
        const name = field.path ? `${field.path}.${field.name}` : field.name;
        return (
          <TextInputField
            control={control}
            name={name as FieldPath<TUserDetailForm>}
            label={field.label}
            description={field.description ?? field.label}
            type={field.attributeType}
            placeholder={field.placeholder}
          />
        );
      })}
      <span className="col-span-2 flex items-center row-start-8">
        <Button className="w-1/6 ml-auto">Update</Button>
      </span>
    </form>
  );
};
