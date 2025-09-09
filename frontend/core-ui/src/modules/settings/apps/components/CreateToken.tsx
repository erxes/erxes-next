import { useAddAppToken } from '@/settings/apps/hooks/useAddAppToken';
import { useCreateAppForm } from '@/settings/apps/hooks/useCreateAppForm';
import { TCreateAppForm } from '@/settings/apps/types';
import { SettingsWorkspacePath } from '@/types/paths/SettingsPath';
import { IconChevronLeft, IconPlus } from '@tabler/icons-react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Spinner,
  Switch,
  toast,
} from 'erxes-ui';
import React from 'react';
import { useNavigate } from 'react-router';
import { SelectUsersGroup } from 'ui-modules';

export const CreateToken = () => {
  const navigate = useNavigate();
  const { methods } = useCreateAppForm();
  const { control, handleSubmit, reset, watch } = methods;
  const { appsAdd, loading } = useAddAppToken();

  const [noExpire, allowAllPermission] = watch([
    'noExpire',
    'allowAllPermission',
  ]);

  const onSubmit = (data: TCreateAppForm) => {
    appsAdd({
      variables: data,
      onCompleted: () => {
        toast({ title: 'Created a token' });
        navigate(SettingsWorkspacePath.Apps);
        reset();
      },
      onError: (error) =>
        toast({ title: error.message, variant: 'destructive' }),
    });
  };

  return (
    <Form {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg w-full mx-auto flex flex-col space-y-4"
      >
        <fieldset className="grid grid-cols-2 gap-3">
          <legend className="font-semibold text-lg pt-4 pb-6 flex items-center gap-x-1">
            <Button
              variant={'ghost'}
              size={'icon'}
              onClick={() => navigate(-1)}
            >
              <IconChevronLeft />
            </Button>
            New token
          </legend>
          <Form.Field
            control={control}
            name="name"
            render={({ field }) => (
              <Form.Item className="col-span-2">
                <Form.Label>Name</Form.Label>
                <Form.Control>
                  <Input {...field} placeholder="Name" />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
          <span className="grid grid-cols-2 col-span-2">
            <Form.Field
              control={control}
              name="allowAllPermission"
              render={({ field }) => (
                <Form.Item className="flex flex-wrap">
                  <Form.Label className="w-full">Allow all</Form.Label>
                  <Form.Control>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            {(allowAllPermission && null) || (
              <Form.Field
                control={control}
                name="userGroupId"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>User group</Form.Label>
                    <Form.Control>
                      <SelectUsersGroup.FormItem
                        value={field.value}
                        mode="single"
                        onValueChange={field.onChange}
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            )}
          </span>
          <span className="grid grid-cols-2 col-span-2">
            <Form.Field
              control={control}
              name="noExpire"
              render={({ field }) => (
                <Form.Item className="flex flex-wrap">
                  <Form.Label className="w-full">No expire</Form.Label>
                  <Form.Control>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            {(noExpire && null) || (
              <Form.Field
                control={control}
                name="expireDate"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Expire date</Form.Label>
                    <Form.Control>
                      <DatePicker
                        defaultMonth={field.value || new Date()}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            )}
          </span>
        </fieldset>
        <div role="group" className="w-full flex items-center pt-6">
          <Button type="submit" className="isolate ml-auto" disabled={loading}>
            {(loading && <Spinner />) || <IconPlus />}
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
};
