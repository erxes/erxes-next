import { IconUpload } from '@tabler/icons-react';
import { Form, Input, Textarea, Upload } from 'erxes-ui';

export const CmsPostSeo = ({ control }: any) => {
  return (
    <>
      <Form.Field
        control={control}
        name="seoTitle"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Slug</Form.Label>
            <Form.Control>
              <Input placeholder="SEO Title" {...field} />
            </Form.Control>
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="seoTitle"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Seo</Form.Label>
            <Form.Control>
              <Input placeholder="SEO Title" {...field} />
            </Form.Control>
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="seoDescription"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Description</Form.Label>
            <Form.Control>
              <Textarea placeholder="SEO Description" {...field} />
            </Form.Control>
          </Form.Item>
        )}
      />
      <Form.Field
        control={control}
        name="attachment"
        render={({ field }) => (
          <Form.Item className="mb-5">
            <Form.Label>UPLOAD</Form.Label>
            <Form.Control>
              <Upload.Root {...field}>
                <Upload.Preview className="hidden" />
                <Upload.Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  className="w-full h-20 flex flex-col items-center justify-center border border-dashed border-muted-foreground text-muted-foreground"
                >
                  <IconUpload />
                  <span className="font-medium text-sm">Primary upload</span>
                </Upload.Button>
              </Upload.Root>
            </Form.Control>
            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
    </>
  );
};
