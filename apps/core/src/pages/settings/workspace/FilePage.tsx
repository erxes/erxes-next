import { IconLoader2 } from '@tabler/icons-react';
import {
  Breadcrumb,
  Header,
  Label,
  Button,
  Form,
  ScrollArea
} from 'erxes-ui/components';
import { useMemo } from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadConfigFormT, validationSchema, serviceFields } from '@/settings/form/schema';
import { FILE_MIME_TYPES, FILE_SYSTEM_TYPES } from '@/settings/constants';
import { useConfigsList, useConfigsUpdate } from '@/settings/hooks/useConfigs';
import FileUploadMainFields from '@/settings/components/FileUploadMainFields';
import UploadServiceRadioGroup from '@/settings/components/UploadServiceRadioGroup';
import DynamicServiceConfigFields from '@/settings/components/DynamicServiceConfigFields';

type Option = {
  label: string;
  value: string
}

const modifiedArray: Option[] = FILE_MIME_TYPES.map(({ label, extension, value }) => ({
  label: `${label} (${extension})`,
  value: value
}));

export default function FilePage() {
  const { configs } = useConfigsList()
  const { updateConfig, loading } = useConfigsUpdate();
  const existingConfigs = useMemo(() => {
    if (configs) {
      return configs.reduce((acc, { code, value }) => {
        acc[code] = value;
        return acc;
      }, {} as Record<string, any>);
    }
    return {};
  }, [configs]);
  const form = useForm<UploadConfigFormT>({
    resolver: zodResolver(validationSchema),
    defaultValues: existingConfigs
  });
  console.log('conf', form.getValues())
  const dynamicFields = useMemo(() => {
    const selectedType = form.watch('UPLOAD_SERVICE_TYPE');
    return serviceFields[selectedType]?.fields || [];
  }, [form.watch('UPLOAD_SERVICE_TYPE')]);

  const selected = useMemo(() => {
    const selectedType = form.watch('UPLOAD_SERVICE_TYPE');
    return selectedType
  }, [form.watch('UPLOAD_SERVICE_TYPE')])


  const onSubmit = (data: UploadConfigFormT) => {
    updateConfig(data)
  };

  return (
    <ScrollArea.Root>
      <section className="mx-auto max-w-2xl w-full relative">
        <Header className=''>
          <Breadcrumb.Root>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link>Settings</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page>File upload</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </Header>
        <h2 className="font-semibold text-lg mt-4 mb-12 px-4">File Upload</h2>
        <div className="flex flex-col gap-8 px-4 w-full h-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-y-6'>
              <FileUploadMainFields
                form={form}
                modifiedArray={modifiedArray}
              />
              <Label>Upload Service Type</Label>

              <UploadServiceRadioGroup
                selected={selected}
                form={form}
              />

              <DynamicServiceConfigFields
                dynamicFields={dynamicFields}
                selected={selected}
                form={form}
              />

              <div className='grid grid-cols-4 py-4 col-start-3 gap-2 w-full'>
                <motion.div whileTap={{ scale: .975 }} className='w-full col-start-3'>
                  <Button type='reset' variant={'destructive'} className='w-full'>Cancel</Button>
                </motion.div>
                <motion.div whileTap={{ scale: .975 }} className='w-full'>
                  <Button type='submit' disabled={loading} variant='outline' className='w-full'>
                    {
                      loading && <IconLoader2 className='animate-spin' /> || 'Update'
                    }
                  </Button>
                </motion.div>
              </div>
            </form>
          </Form>
        </div>
      </section>
      <ScrollArea.Bar />
    </ScrollArea.Root>
  )
}