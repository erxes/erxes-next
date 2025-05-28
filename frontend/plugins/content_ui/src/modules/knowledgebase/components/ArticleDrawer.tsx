'use client';

import { useMutation } from '@apollo/client';
import { IconUpload } from '@tabler/icons-react';
import { Button, Form, Input, Sheet, Textarea, Upload, Select } from 'erxes-ui';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ADD_ARTICLE, EDIT_ARTICLE } from '../graphql/mutations';
import { ARTICLES } from '../graphql/queries';

interface ReactionChoice {
  value: string;
  label: string;
}

const REACTION_CHOICES: ReactionChoice[] = [
  { value: 'like', label: 'Like' },
  { value: 'dislike', label: 'Dislike' },
  { value: 'helpful', label: 'Helpful' },
  { value: 'not_helpful', label: 'Not Helpful' },
];

interface Article {
  _id: string;
  code: string;
  title: string;
  summary: string;
  content: string;
  status: string;
  isPrivate: boolean;
  reactionChoices: string[];
  image: string;
  attachments: string[];
  pdfAttachment: string;
  categoryId: string;
}

interface ArticleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  article?: Article;
  categoryId: string;
}

interface ArticleFormData {
  code: string;
  title: string;
  summary: string;
  content: string;
  status: string;
  isPrivate: boolean;
  reactionChoices: string[];
  image: string;
  attachments: string[];
  pdfAttachment: string;
}

export function ArticleDrawer({
  isOpen,
  onClose,
  article,
  categoryId,
}: ArticleDrawerProps) {
  const isEditing = !!article;

  const form = useForm<ArticleFormData>({
    defaultValues: {
      code: '',
      title: '',
      summary: '',
      content: '',
      status: 'draft',
      isPrivate: false,
      reactionChoices: [],
      image: '',
      attachments: [],
      pdfAttachment: '',
    },
  });

  useEffect(() => {
    if (article) {
      form.reset({
        code: article.code || '',
        title: article.title || '',
        summary: article.summary || '',
        content: article.content || '',
        status: article.status || 'draft',
        isPrivate: article.isPrivate || false,
        reactionChoices: article.reactionChoices || [],
        image: article.image || '',
        attachments: article.attachments || [],
        pdfAttachment: article.pdfAttachment || '',
      });
    } else {
      form.reset({
        code: '',
        title: '',
        summary: '',
        content: '',
        status: 'draft',
        isPrivate: false,
        reactionChoices: [],
        image: '',
        attachments: [],
        pdfAttachment: '',
      });
    }
  }, [article, form]);

  const [addArticle, { loading: adding }] = useMutation(ADD_ARTICLE, {
    refetchQueries: [{ query: ARTICLES }],
    onCompleted: () => {
      onClose();
      form.reset();
    },
  });

  const [editArticle, { loading: editing }] = useMutation(EDIT_ARTICLE, {
    refetchQueries: [{ query: ARTICLES }],
    onCompleted: () => {
      onClose();
      form.reset();
    },
  });

  const onSubmit = (data: ArticleFormData) => {
    if (isEditing && article) {
      editArticle({
        variables: {
          _id: article._id,
          input: {
            ...data,
            categoryId: categoryId || article.categoryId,
          },
        },
      });
    } else {
      addArticle({
        variables: {
          input: {
            ...data,
            categoryId,
          },
        },
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <Sheet.View className="sm:max-w-lg p-0">
        <Sheet.Header className="border-b gap-3">
          <Sheet.Title>
            {isEditing ? 'Edit Article' : 'New Article'}
          </Sheet.Title>
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
                    <Input {...field} placeholder="Enter article code" />
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
                      placeholder="Enter article title"
                      required
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="summary"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Summary</Form.Label>
                  <Form.Control>
                    <Textarea {...field} placeholder="Enter article summary" />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="content"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Content</Form.Label>
                  <Form.Control>
                    <Textarea {...field} placeholder="Enter article content" />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="status"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Status</Form.Label>
                  <Form.Control>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <Select.Item value="draft">Draft</Select.Item>
                      <Select.Item value="published">Published</Select.Item>
                      <Select.Item value="archived">Archived</Select.Item>
                    </Select>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Is Private</Form.Label>
                  <Form.Control>
                    <Input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="reactionChoices"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Reaction Choices</Form.Label>
                  <Form.Control>
                    <Select
                      value={field.value[0]}
                      onValueChange={(value) => field.onChange([value])}
                    >
                      {REACTION_CHOICES.map((choice) => (
                        <Select.Item key={choice.value} value={choice.value}>
                          {choice.label}
                        </Select.Item>
                      ))}
                    </Select>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="image"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Image</Form.Label>
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
              name="attachments"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Attachments</Form.Label>
                  <Form.Control>
                    <Upload.Root
                      value={field.value[0]}
                      onChange={(fileInfo) => {
                        if ('url' in fileInfo) {
                          field.onChange([...field.value, fileInfo.url]);
                        }
                      }}
                      multiple
                    >
                      <Upload.Preview />
                      <div className="flex flex-col gap-2">
                        <Upload.Button
                          size="sm"
                          variant="outline"
                          type="button"
                        >
                          <IconUpload className="h-4 w-4 mr-2" />
                          Upload files
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
              name="pdfAttachment"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>PDF Attachment</Form.Label>
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
                          Upload PDF
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

            <div className="flex justify-end space-x-2">
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={adding || editing}>
                {adding || editing
                  ? isEditing
                    ? 'Saving...'
                    : 'Creating...'
                  : isEditing
                  ? 'Save Changes'
                  : 'Create Article'}
              </Button>
            </div>
          </form>
        </Form>
      </Sheet.View>
    </Sheet>
  );
}
