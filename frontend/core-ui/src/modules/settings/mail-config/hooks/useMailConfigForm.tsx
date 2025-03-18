import { SubmitHandler, useForm } from 'react-hook-form';
import { TCustomMailConfig, TSESMailConfig } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { mailConfigSchema } from '../schema';
import { useCallback } from 'react';
import { useConfig } from '@/settings/file-upload/hook/useConfigs';

type TProps = TCustomMailConfig | TSESMailConfig;

interface TConfig {
  _id: string;
  code: keyof TProps;
  value: any;
}

const useMailConfigForm = () => {
  const { updateConfig, configs } = useConfig();
  const methods = useForm<TProps>({
    mode: 'onBlur',
    resolver: zodResolver(mailConfigSchema),
    defaultValues: {
      COMPANY_EMAIL_FROM: '',
      COMPANY_EMAIL_TEMPLATE_TYPE: 'simple',
      COMPANY_EMAIL_TEMPLATE: '',
      DEFAULT_EMAIL_SERVICE: 'SES',

      MAIL_SERVICE: '',
      MAIL_PORT: '',
      MAIL_USER: '',
      MAIL_PASS: '',
      MAIL_HOST: '',

      AWS_SES_ACCESS_KEY_ID: '',
      AWS_SES_SECRET_ACCESS_KEY: '',
      AWS_REGION: '',
      AWS_SES_CONFIG_SET: '',
    } as TProps,
  });

  const submitHandler: SubmitHandler<TProps> = useCallback(async (data) => {
    const updatedConfigs = configs.reduce((acc: any, config: TConfig) => {
      acc[config.code] = data[config.code] ?? config.value;
      return acc;
    }, {} as Record<string, any>);
    updateConfig(updatedConfigs);
  }, []);

  return {
    methods,
    submitHandler,
  };
};

export { useMailConfigForm };
