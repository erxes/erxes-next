'use client';

import { useMutation } from '@apollo/client';
import {
  IconUpload,
  IconSettings,
  IconPalette,
  IconShieldLock,
  IconCircleDashedCheck,
} from '@tabler/icons-react';
import {
  Button,
  Form,
  Input,
  Select,
  Sheet,
  Textarea,
  toast,
  Upload,
} from 'erxes-ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ADD_TOPIC, EDIT_TOPIC } from '../graphql/mutations';
import { TOPICS } from '../graphql/queries';
import { SelectBrand } from 'ui-modules';
import { LANGUAGES } from '../../../constants';
import { SelectLanguage } from './SelectLanguage';

interface Topic {
  _id: string;
  title: string;
  description: string;
  code: string;
  brandId: string;
  color: string;
  backgroundImage: string;
  languageCode: string;
  notificationSegmentId: string;
}

interface TopicDrawerProps {
  topic?: Topic;
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (portal: { title: string; url: string }) => void;
}

interface TopicFormData {
  code: string;
  title: string;
  description: string;
  brandId: string;
  color: string;
  backgroundImage: string;
  languageCode: string;
  notificationSegmentId: string;
}

const steps = [
  { id: 'general', label: 'General Settings' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'authentication', label: 'Authentication' },
];

export function ClientPortalDrawer({
  topic,
  isOpen,
  onClose,
  onCreate,
}: TopicDrawerProps) {
  const isEditing = !!topic;
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<TopicFormData>({
    defaultValues: {
      code: '',
      title: '',
      description: '',
      brandId: '',
      color: '',
      backgroundImage: '',
      languageCode: '',
      notificationSegmentId: '',
    },
  });

  useEffect(() => {
    if (topic) {
      form.reset({
        code: topic.code || '',
        title: topic.title || '',
        description: topic.description || '',
        brandId: topic.brandId || '',
        color: topic.color || '',
        backgroundImage: topic.backgroundImage || '',
        languageCode: topic.languageCode || '',
        notificationSegmentId: topic.notificationSegmentId || '',
      });
    } else {
      form.reset({
        code: '',
        title: '',
        description: '',
        brandId: '',
        color: '',
        backgroundImage: '',
        languageCode: '',
        notificationSegmentId: '',
      });
    }
  }, [topic, form]);

  const onSubmit = (data: TopicFormData) => {
    if (onCreate) {
      onCreate({
        title: data.code,
        url: data.title,
      });
    }
    onClose();
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Form.Field
              control={form.control}
              name="code"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Client portal name</Form.Label>
                  <Form.Control>
                    <Input {...field} placeholder="Enter portal name" />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="description"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Description</Form.Label>
                  <Form.Control>
                    <Textarea
                      {...field}
                      placeholder="Enter portal description"
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="title"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Website</Form.Label>
                  <Form.Control>
                    <Input {...field} placeholder="Enter url" required />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="languageCode"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Language</Form.Label>
                  <Form.Control>
                    <SelectLanguage
                      {...field}
                      onSelect={field.onChange}
                      selected={field.value}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <Form.Field
              control={form.control}
              name="color"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Color</Form.Label>
                  <Form.Control>
                    <Input {...field} type="color" />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="backgroundImage"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Background Image</Form.Label>
                  <Form.Control>
                    <Upload.Root
                      value={field.value}
                      onChange={(fileInfo) => {
                        if ('url' in fileInfo) {
                          field.onChange(fileInfo.url);
                        }
                      }}
                    >
                      <Upload.Preview />
                      <div className="flex flex-col gap-2">
                        <Upload.Button
                          size="sm"
                          variant="outline"
                          type="button"
                        >
                          <IconUpload className="h-4 w-4 mr-2" />
                          Upload image
                        </Upload.Button>
                        <Upload.RemoveButton
                          size="sm"
                          variant="outline"
                          type="button"
                        />
                      </div>
                    </Upload.Root>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="languageCode"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Language Code</Form.Label>
                  <Form.Control>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Select language" />
                      </Select.Trigger>
                      <Select.Content>
                        {LANGUAGES.map((lang) => (
                          <Select.Item key={lang.value} value={lang.value}>
                            {lang.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Form.Field
              control={form.control}
              name="notificationSegmentId"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Notification Segment</Form.Label>
                  <Form.Control>
                    <Input
                      {...field}
                      placeholder="Enter notification segment ID"
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <Sheet.View className="sm:max-w-lg p-0">
        <Sheet.Header className="border-b gap-3">
          <Sheet.Title>New Client Portal</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>

        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index !== steps.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    index === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : index < currentStep
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted'
                  }`}
                >
                  {index < currentStep ? (
                    <IconCircleDashedCheck className="w-4 h-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="ml-2 text-sm font-medium">{step.label}</div>
                {index !== steps.length - 1 && (
                  <div className="flex-1 h-px bg-border ml-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 space-y-4"
          >
            {renderStepContent()}

            <div className="flex justify-end space-x-2">
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit">Create Portal</Button>
              )}
            </div>
          </form>
        </Form>
      </Sheet.View>
    </Sheet>
  );
}
