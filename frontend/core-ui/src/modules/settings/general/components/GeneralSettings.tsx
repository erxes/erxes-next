import { Button, Form, Spinner, useToast } from 'erxes-ui';
import { useGeneralSettingsForms } from '../hooks/useGeneralSettingsForms';
import SelectControl from './SelectControl';
import { LANGUAGES } from '../constants/data';
import { IconLoader2 } from '@tabler/icons-react';
import { useSwitchLanguage } from '~/i18n';
import { useConfig } from '@/settings/file-upload/hook/useConfigs';
import { useCallback, useEffect, useState } from 'react';
import { SelectCurrency } from '@/settings/general/components/SelectCurrency';
import { SubmitHandler } from 'react-hook-form';
import { TGeneralSettingsProps } from '@/settings/general/types';
import { TConfig } from '@/settings/file-upload/types';
import { GeneralSettingsSkeleton } from '@/settings/general/components/GeneralSettingsSkeleton';

const GeneralSettings = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { languages } = useSwitchLanguage();
  const { toast } = useToast();
  const {
    methods,
    methods: { control },
    handleLanguage,
  } = useGeneralSettingsForms();
  const { configs, updateConfig, loading } = useConfig();

  const updateCurrency = async (data: TGeneralSettingsProps) => {
    const updatedConfigs = configs.reduce(
      (acc: Record<string, any>, config: TConfig) => {
        const key = config.code as keyof TGeneralSettingsProps;
        acc[config.code] = key in data ? data[key] : config.value;
        return acc;
      },
      {} as Record<string, any>,
    );
    await updateConfig(updatedConfigs);
  };

  const submitHandler: SubmitHandler<TGeneralSettingsProps> = useCallback(
    async (data) => {
      setIsLoading(true);
      try {
        await updateCurrency(data);
        await handleLanguage(data.languageCode).then(() => {
          toast({
            title: 'Updated successfully',
            description: `Language switched to (${data.languageCode})`,
          });
        });
      } catch (error) {
        console.error('Error occurred on form submit', error);
      } finally {
        setIsLoading(false);
      }
    },
    [updateCurrency, handleLanguage, toast, setIsLoading],
  );

  useEffect(() => {
    if (configs) {
      const currencies = configs?.find(
        (data: any) => data.code === 'dealCurrency',
      );
      methods.setValue('dealCurrency', currencies?.value);
    }
  }, [configs, methods]);

  if (loading) {
    return <GeneralSettingsSkeleton />;
  }

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
        <SelectCurrency />
        <Button
          size={'sm'}
          disabled={isLoading}
          type="submit"
          className="w-1/4 ml-auto"
        >
          {isLoading ? (
            <Spinner className="stroke-white/90 w-4 h-4" />
          ) : (
            'Update'
          )}
        </Button>
      </form>
    </Form>
  );
};

export { GeneralSettings };
