import { useState } from 'react';
import { Button, Form, Select, Resizable } from 'erxes-ui';
import { useForm } from 'react-hook-form';
import {
  IconChevronLeft,
  IconX,
  IconDeviceDesktop,
  IconDeviceIpad,
  IconDeviceMobile,
} from '@tabler/icons-react';

import { CmsPostForm } from '~/modules/posts/components/CmsPostForm';
import { CmsPostSeo } from '~/modules/posts/components/CmsPostSeo';
import { useCmsContext } from '~/modules/app/context/CmsContext';
import { Link } from 'react-router-dom';

export const CmsCreatePost = () => {
  const { selectedWebsite } = useCmsContext();

  const form = useForm({
    defaultValues: {
      name: '',
      type: '',
      description: '',
      status: '',
      categoryId: '',
      tag: '',
      featured: false,
      seoTitle: '',
      seoDescription: '',
    },
  });

  const [selectedDevice, setSelectedDevice] = useState<
    'desktop' | 'tablet' | 'mobile'
  >('desktop');
  const [selectedStep, setSelectedStep] = useState<'content' | 'seo'>(
    'content',
  );

  const types = [
    { value: 'article', label: 'Article' },
    { value: 'video', label: 'Video' },
  ];

  const statuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'scheduled', label: 'Scheduled' },
  ];

  const categories = [
    { value: 'tech', label: 'Tech' },
    { value: 'design', label: 'Design' },
  ];

  const tags = [
    { value: 'ai', label: 'AI' },
    { value: 'ui', label: 'UI' },
  ];

  const devices = [
    { key: 'desktop', label: 'Desktop', icon: <IconDeviceDesktop size={24} /> },
    { key: 'tablet', label: 'Tablet', icon: <IconDeviceIpad size={24} /> },
    { key: 'mobile', label: 'Mobile', icon: <IconDeviceMobile size={24} /> },
  ];

  const steps = [
    { key: 'content', label: 'Content' },
    { key: 'seo', label: 'SEO' },
  ];

  const onSubmit = (data: any) => {
    console.log('Submitted data:', data);
  };

  return (
    <Resizable.PanelGroup direction="horizontal" className="flex-1 h-screen">
      <Resizable.Panel minSize={20} defaultSize={50}>
        <div className="p-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Link to={`/cms/${selectedWebsite}/posts`}>
                <IconChevronLeft />
              </Link>
              <h2 className="text-lg font-semibold">New post</h2>
            </div>
            <div className="w-[28px] h-[28px] bg-gray-200 flex items-center justify-center rounded-sm">
              <IconX size={16} />
            </div>
          </div>

          <div className="flex w-full justify-between gap-2 mb-4">
            {steps.map((step) => {
              const isSelected = selectedStep === step.key;
              return (
                <div
                  key={step.key}
                  onClick={() => setSelectedStep(step.key as 'content' | 'seo')}
                  className="flex flex-col gap-2 items-center w-[40%] cursor-pointer"
                >
                  <div
                    className={`flex gap-2 items-center ${
                      isSelected ? 'text-primary' : 'text-gray-500'
                    }`}
                  >
                    <span>{step.label}</span>
                  </div>
                  <div
                    className={`h-[1px] w-full ${
                      isSelected ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                </div>
              );
            })}
            <Select>
              <Select.Trigger className="w-[15%] text-sm h-8">
                <Select.Value placeholder="MN" />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.Item value="MN">MN</Select.Item>
                  <Select.Item value="EN">EN</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {selectedStep === 'content' ? (
                <CmsPostForm
                  control={form.control}
                  register={form.register}
                  types={types}
                  statuses={statuses}
                  categories={categories}
                  tags={tags}
                />
              ) : (
                <CmsPostSeo control={form.control} />
              )}

              <div className="flex w-full justify-between mt-6">
                <Button variant="outline">Cancel</Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Resizable.Panel>

      <Resizable.Handle />

      <Resizable.Panel minSize={20} defaultSize={50}>
        <div className="flex justify-center items-center flex-col p-6 gap-6">
          <p className="text-[16px] text-primary-black">PREVIEW</p>
          <div className="flex justify-between w-full">
            {devices.map((device) => {
              const isSelected = selectedDevice === device.key;
              return (
                <div
                  key={device.key}
                  onClick={() =>
                    setSelectedDevice(
                      device.key as 'desktop' | 'tablet' | 'mobile',
                    )
                  }
                  className="flex flex-col gap-2 items-center w-[30%] cursor-pointer"
                >
                  <div
                    className={`flex gap-2 items-center ${
                      isSelected ? 'text-primary' : 'text-gray-500'
                    }`}
                  >
                    {device.icon}
                    <span>{device.label}</span>
                  </div>
                  <div
                    className={`h-[1px] w-full ${
                      isSelected ? 'bg-primary' : 'bg-gray-500'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Resizable.Panel>
    </Resizable.PanelGroup>
  );
};
