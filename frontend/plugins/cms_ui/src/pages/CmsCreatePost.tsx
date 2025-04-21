import { useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Textarea,
  Switch,
  Resizable,
} from 'erxes-ui';
import { useForm } from 'react-hook-form';
import {
  IconChevronLeft,
  IconX,
  IconDeviceDesktop,
  IconDeviceIpad,
  IconDeviceMobile,
} from '@tabler/icons-react';

import { CmsPostSeo } from '~/modules/posts/components/CmsPostSeo';
import { useCmsContext } from '~/modules/app/context/CmsContext';
import { useAddPost } from '~/modules/cms/hooks/useCreatePost';
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

  const { tagAdd, loading, error } = useAddPost();

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

  const onSubmit = async (data: any) => {
    console.log(data);
    const input = {
      type: 'post',
      clientPortalId: selectedWebsite,
      title: data.name,
      slug: '',
      content: `<p>${data.description}</p>`,
      excerpt: data.description,
      categoryIds: [],
      tagIds: [],
      status: 'draft',
      authorId: '',
      featured: false,
      reactions: [],
      reactionCounts: {},
      images: [],
      documents: [],
      attachments: [],
      customFieldsData: [],
    };

    try {
      await tagAdd({ variables: { input } });
      alert('Post created successfully!');
      form.reset();
    } catch (err) {
      console.error(err);
      alert('Failed to create post');
    }
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
                <>
                  <div className="flex gap-3">
                    <div className="w-1/2">
                      <Form.Field
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <Form.Item>
                            <Form.Label>Post</Form.Label>
                            <Form.Control>
                              <Input placeholder="Post title" {...field} />
                            </Form.Control>
                          </Form.Item>
                        )}
                      />
                    </div>
                    <div className="w-1/2">
                      <Form.Field
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <Form.Item>
                            <Form.Label>Type</Form.Label>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <Form.Control>
                                <Select.Trigger className="w-full h-8">
                                  <Select.Value placeholder="Choose type" />
                                </Select.Trigger>
                              </Form.Control>
                              <Select.Content>
                                {types.map((t) => (
                                  <Select.Item key={t.value} value={t.value}>
                                    {t.label}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select>
                          </Form.Item>
                        )}
                      />
                    </div>
                  </div>

                  <Form.Field
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label>Description</Form.Label>
                        <Form.Control>
                          <Textarea
                            placeholder="Description here"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </Form.Control>
                      </Form.Item>
                    )}
                  />

                  <Form.Field
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label>Status</Form.Label>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <Form.Control>
                            <Select.Trigger className="w-full h-8">
                              <Select.Value placeholder="Select" />
                            </Select.Trigger>
                          </Form.Control>
                          <Select.Content>
                            {statuses.map((s) => (
                              <Select.Item key={s.value} value={s.value}>
                                {s.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                      </Form.Item>
                    )}
                  />

                  <Form.Field
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label>Category</Form.Label>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <Form.Control>
                            <Select.Trigger className="w-full h-8">
                              <Select.Value placeholder="Select" />
                            </Select.Trigger>
                          </Form.Control>
                          <Select.Content>
                            {categories.map((c) => (
                              <Select.Item key={c.value} value={c.value}>
                                {c.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                      </Form.Item>
                    )}
                  />

                  <Form.Field
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label>Tag</Form.Label>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <Form.Control>
                            <Select.Trigger className="w-full h-8">
                              <Select.Value placeholder="Select" />
                            </Select.Trigger>
                          </Form.Control>
                          <Select.Content>
                            {tags.map((tag) => (
                              <Select.Item key={tag.value} value={tag.value}>
                                {tag.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                      </Form.Item>
                    )}
                  />

                  <Form.Field
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <Form.Item className="flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                          <Form.Label>Featured</Form.Label>
                          <p className="text-sm text-gray-500">
                            Turn this post into a featured post
                          </p>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      </Form.Item>
                    )}
                  />
                </>
              ) : (
                <CmsPostSeo control={form.control} />
              )}

              {error && (
                <p className="text-red-500 text-sm mt-2">
                  Error: {error.message}
                </p>
              )}

              <div className="flex w-full justify-between mt-6">
                <Button variant="outline">Cancel</Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground"
                  // loading={loading}
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
          <div className="bg-red-500 w-full ">sdf</div>
        </div>
      </Resizable.Panel>
    </Resizable.PanelGroup>
  );
};
