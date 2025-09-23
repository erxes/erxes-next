import { useMutation } from '@apollo/client';
import { IconUpload, IconAlertCircle } from '@tabler/icons-react';
import {
  Button,
  Form,
  Input,
  Select,
  Sheet,
  Textarea,
  Upload,
  toast,
} from 'erxes-ui';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CLIENT_PORTAL_CONFIG_UPDATE } from '../graphql/queries';
import { GET_WEBSITES } from '../graphql/queries';
import { SelectBrand } from 'ui-modules';
import { LANGUAGES } from '../../../constants';

interface Website {
  _id: string;
  name: string;
  description: string;
  domain: string;
  url: string;
  kind: string;
  createdAt: string;
}

interface WebsiteDrawerProps {
  website?: Website;
  isOpen: boolean;
  onClose: () => void;
}

interface WebsiteFormData {
  name: string;
  description: string;
  domain: string;
  url: string;
  kind: string;
}

export function WebsiteDrawer({
  website,
  isOpen,
  onClose,
}: WebsiteDrawerProps) {
  const isEditing = !!website;
  const [hasPermissionError, setHasPermissionError] = useState(false);

  const form = useForm<WebsiteFormData>({
    defaultValues: {
      name: '',
      description: '',
      domain: '',
      url: '',
      kind: 'client',
    },
  });

  useEffect(() => {
    if (website) {
      form.reset({
        name: website.name || '',
        description: website.description || '',
        domain: website.domain || '',
        url: website.url || '',
        kind: website.kind || 'client',
      });
    } else {
      form.reset({
        name: '',
        description: '',
        domain: '',
        url: '',
        kind: 'client',
      });
    }
    // Reset permission error when drawer opens
    setHasPermissionError(false);
  }, [website, form, isOpen]);

  const [updateWebsite, { loading: saving }] = useMutation(
    CLIENT_PORTAL_CONFIG_UPDATE,
    {
      refetchQueries: [{ query: GET_WEBSITES }],
      onCompleted: () => {
        onClose();
        form.reset();
        toast({
          title: 'Success',
          description: isEditing
            ? 'Website updated successfully'
            : 'Website created successfully',
          variant: 'default',
        });
      },
      onError: (error) => {
        console.error('Website update error:', error);

        const permissionError = error.graphQLErrors?.some(
          (e) =>
            e.message === 'Permission required' ||
            e.extensions?.code === 'INTERNAL_SERVER_ERROR',
        );

        if (permissionError) {
          setHasPermissionError(true);
          toast({
            title: 'Permission Required',
            description:
              'You do not have permission to manage websites. Please contact your administrator to grant the "manageClientPortal" permission.',
            variant: 'destructive',
            duration: 8000,
          });
        } else {
          toast({
            title: 'Error',
            description:
              error.message || 'Failed to save website. Please try again.',
            variant: 'destructive',
            duration: 5000,
          });
        }
      },
    },
  );

  const onSubmit = (data: WebsiteFormData) => {
    const config = {
      ...data,
      _id: isEditing && website ? website._id : undefined,
    };

    updateWebsite({
      variables: {
        config,
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <Sheet.View className="sm:max-w-lg p-0">
        <Sheet.Header className="border-b gap-3">
          <Sheet.Title>
            {isEditing ? 'Edit Website' : 'New Website'}
          </Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-4 space-y-4"
          >
            {hasPermissionError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <IconAlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-red-800">
                      Permission Required
                    </p>
                    <p className="text-red-700 mt-1">
                      You need the "manageClientPortal" permission to create or
                      edit websites. Please contact your administrator to grant
                      this permission.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Website Name</Form.Label>
                  <Form.Control>
                    <Input
                      {...field}
                      placeholder="Enter website name"
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
                    <Textarea
                      {...field}
                      placeholder="Enter website description"
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="domain"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Domain</Form.Label>
                  <Form.Control>
                    <Input {...field} placeholder="example.com" />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="url"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>URL</Form.Label>
                  <Form.Control>
                    <Input
                      {...field}
                      placeholder="https://example.com"
                      type="url"
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="kind"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Type</Form.Label>
                  <Form.Control>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Select type" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="client">Client Portal</Select.Item>
                        <Select.Item value="vendor">Vendor Portal</Select.Item>
                      </Select.Content>
                    </Select>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={saving || hasPermissionError}>
                {saving
                  ? isEditing
                    ? 'Saving...'
                    : 'Creating...'
                  : hasPermissionError
                  ? 'Permission Required'
                  : isEditing
                  ? 'Save Changes'
                  : 'Create Website'}
              </Button>
            </div>
          </form>
        </Form>
      </Sheet.View>
    </Sheet>
  );
}
