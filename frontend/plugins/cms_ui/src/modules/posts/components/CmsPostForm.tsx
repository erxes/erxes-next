import { Form, Input, Select, Textarea, Switch } from 'erxes-ui';

export const CmsPostForm = ({
  control,
  register,
  types,
  statuses,
  categories,
  tags,
}: any) => {
  return (
    <>
      <div className="flex w-full justify-between gap-3">
        <div className="w-1/2">
          <Form.Field
            control={control}
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
            control={control}
            name="type"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Type</Form.Label>
                <Select onValueChange={field.onChange} value={field.value}>
                  <Form.Control>
                    <Select.Trigger className="w-full h-8">
                      <Select.Value placeholder="Choose type" />
                    </Select.Trigger>
                  </Form.Control>
                  <Select.Content>
                    {types.map((type: any) => (
                      <Select.Item key={type.value} value={type.value}>
                        {type.label}
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
        control={control}
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
        control={control}
        name="status"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Status</Form.Label>
            <Select onValueChange={field.onChange} value={field.value}>
              <Form.Control>
                <Select.Trigger className="w-full h-8">
                  <Select.Value placeholder="Select" />
                </Select.Trigger>
              </Form.Control>
              <Select.Content>
                {statuses.map((status: any) => (
                  <Select.Item key={status.value} value={status.value}>
                    {status.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Form.Item>
        )}
      />

      <Form.Field
        control={control}
        name="categoryId"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Category</Form.Label>
            <Select onValueChange={field.onChange} value={field.value}>
              <Form.Control>
                <Select.Trigger className="w-full h-8">
                  <Select.Value placeholder="Select" />
                </Select.Trigger>
              </Form.Control>
              <Select.Content>
                {categories.map((category: any) => (
                  <Select.Item key={category.value} value={category.value}>
                    {category.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Form.Item>
        )}
      />

      <Form.Field
        control={control}
        name="tag"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Tag</Form.Label>
            <Select onValueChange={field.onChange} value={field.value}>
              <Form.Control>
                <Select.Trigger className="w-full h-8">
                  <Select.Value placeholder="Select" />
                </Select.Trigger>
              </Form.Control>
              <Select.Content>
                {tags.map((tag: any) => (
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
        control={control}
        name="featured"
        render={({ field }) => (
          <Form.Item className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <Form.Label>Featured</Form.Label>
              <p className="text-sm text-gray-500">
                Turn this post into a featured post
              </p>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </div>
          </Form.Item>
        )}
      />
    </>
  );
};
