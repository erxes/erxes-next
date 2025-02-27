import { Button, Form } from 'erxes-ui/components';
import { useGeneralSettingsForms } from '../hooks/useGeneralSettingsForms';
import SelectControl from './SelectControl';
import { LANGUAGES } from '../constants/data';
import { IconLoader2 } from '@tabler/icons-react';
import { useSwitchLanguage } from '~/i18n';

const GeneralSettings = () => {
  const { languages } = useSwitchLanguage();
  const {
    methods,
    methods: { control },
    submitHandler,
    isLoading,
  } = useGeneralSettingsForms();
  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(submitHandler)}
        className="py-1 flex flex-col space-y-3"
      >
        <SelectControl
          control={control}
          name="languageCode"
          options={LANGUAGES.filter((lang) =>
            languages.some((lng) => lang.value === lng),
          )}
          placeholder="Languages"
          label="Language"
        />
        <Button size={'sm'} type="submit" className="w-1/4 ml-auto">
          {(isLoading && <IconLoader2 className="animate-spin" />) || 'Update'}
        </Button>
      </form>
    </Form>
  );
};

export { GeneralSettings };
