import { Form, Input, Textarea } from 'erxes-ui';

export const CmsPostSeo = ({ control }: any) => {
  return (
    <>
      <Form.Field
        control={control}
        name="seoTitle"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>SEO Title</Form.Label>
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
            <Form.Label>SEO Description</Form.Label>
            <Form.Control>
              <Textarea placeholder="SEO Description" {...field} />
            </Form.Control>
          </Form.Item>
        )}
      />
    </>
  );
};
