import { Form } from 'erxes-ui/components';
import { useGeneralSettingsForms } from '../hooks/useGeneralSettingsForms';
import { CURRENCY_CODES, LANGUAGES } from '../constants/data';
import SelectControl from './SelectControl';

const GeneralSettings = () => {
  const {
    methods,
    methods: { control },
    submitHandler,
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
          options={LANGUAGES}
          placeholder="Languages"
          label="Language"
        />
      </form>
    </Form>
  );
};

export { GeneralSettings };
