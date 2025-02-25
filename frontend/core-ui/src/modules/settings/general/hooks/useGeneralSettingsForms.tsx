import React, { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TGeneralSettingsProps } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { generalSettingsSchema } from '../schema';

const useGeneralSettingsForms = () => {
  const methods = useForm<TGeneralSettingsProps>({
    mode: 'onBlur',
    defaultValues: {
      languageCode: 'en',
      dealCurrency: [],
      CHECK_TEAM_MEMBER_SHOWN: false,
      BRANCHES_MASTER_TEAM_MEMBERS_IDS: [],
      DEPARTMENTS_MASTER_TEAM_MEMBERS_IDS: [],
    },
    resolver: zodResolver(generalSettingsSchema),
  });

  const submitHandler: SubmitHandler<TGeneralSettingsProps> = useCallback(
    async (data) => {
      try {
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
  };
};

export { useGeneralSettingsForms };
