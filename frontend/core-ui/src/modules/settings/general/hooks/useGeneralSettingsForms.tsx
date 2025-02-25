import React, { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TGeneralSettingsProps } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { generalSettingsSchema } from '../schema';
import { AvailableLanguage, useSwitchLanguage } from '~/i18n';
import { useToast } from 'erxes-ui/hooks';

const useGeneralSettingsForms = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { currentLanguage, switchLanguage } = useSwitchLanguage();
  const methods = useForm<TGeneralSettingsProps>({
    mode: 'onBlur',
    defaultValues: {
      languageCode: currentLanguage,
      dealCurrency: [],
      CHECK_TEAM_MEMBER_SHOWN: false,
      BRANCHES_MASTER_TEAM_MEMBERS_IDS: [],
      DEPARTMENTS_MASTER_TEAM_MEMBERS_IDS: [],
    },
    resolver: zodResolver(generalSettingsSchema),
  });

  const handleLanguage = async (lng: string) => {
    setIsLoading(true);
    await switchLanguage(lng as AvailableLanguage);
  };

  const submitHandler: SubmitHandler<TGeneralSettingsProps> = useCallback(
    async (data) => {
      try {
        await handleLanguage(data.languageCode).then(() => {
          setIsLoading(false);
          toast({
            title: 'Updated successfully',
            description: `Language switched to (${data.languageCode})`,
          });
        });
        console.log(data);
      } catch (error) {
        console.error('Error occured on form submit', error);
      }
    },
    [],
  );

  return {
    methods,
    submitHandler,
    isLoading,
  };
};

export { useGeneralSettingsForms };
