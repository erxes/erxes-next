'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { ADD_TOPIC } from '../graphql/mutations';
import { TOPICS } from '../graphql/queries';
import { Form, Input, Upload, Editor, Sheet, Button } from 'erxes-ui';
import { IconUpload } from '@tabler/icons-react';
// import { SelectSegment } from 'ui-modules';

interface NewTopicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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

export function NewTopicDrawer({ isOpen, onClose }: NewTopicDrawerProps) {
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

  const [addTopic, { loading }] = useMutation(ADD_TOPIC, {
    refetchQueries: [{ query: TOPICS }],
    onCompleted: () => {
      onClose();
      form.reset();
    },
  });

  const onSubmit = (data: TopicFormData) => {
    addTopic({
      variables: {
        input: data,
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <Sheet.View className="sm:max-w-lg p-0">
        <Sheet.Header className="border-b gap-3">
          <Sheet.Title>New Topic</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 space-y-4"
          >
            <Form.Field
              control={form.control}
              name="code"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Code</Form.Label>
                  <Form.Control>
                    <Input {...field} placeholder="Enter topic code" />
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
                  <Form.Label>Title</Form.Label>
                  <Form.Control>
                    <Input
                      {...field}
                      placeholder="Enter topic title"
                      required
                    />
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
                    <Editor
                      initialContent={field.value}
                      onChange={field.onChange}
                      scope="topic-description"
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

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
                    <Input {...field} placeholder="Enter language code" />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            {/* <Form.Field
              control={form.control}
              name="notificationSegmentId"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Notification Segment</Form.Label>
                  <Form.Control>
                    <SelectSegment
                      selected={field.value}
                      onSelect={field.onChange}
                      nullable
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            /> */}

            <div className="flex justify-end space-x-2">
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Topic'}
              </Button>
            </div>
          </form>
        </Form>
      </Sheet.View>
    </Sheet>
  );
}
