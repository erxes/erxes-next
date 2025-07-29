import { Control } from 'react-hook-form';
import { Button, ColorPicker, Form, Input, Upload } from 'erxes-ui';
import PmsFormFieldsLayout from '../PmsFormFieldsLayout';
import Heading from '../../ui/heading';
import { IconTrash, IconUpload, IconX } from '@tabler/icons-react';
import { PmsBranchFormType } from '@/pms/constants/formSchema';

const Appearance = ({ control }: { control: Control<PmsBranchFormType> }) => {
  return (
    <PmsFormFieldsLayout>
      <Heading>Logo and favicon</Heading>
      <div className="grid-cols-3 xl:grid">
        <Form.Field
          control={control}
          name="logo"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Main logo</Form.Label>
              <Form.Description>
                Image can be shown on the top of the post also{' '}
              </Form.Description>
              <Form.Control>
                <Upload.Root
                  value={field.value ?? ''}
                  onChange={field.onChange}
                >
                  {field.value ? (
                    <div className="relative w-full">
                      <div className="flex justify-center items-center w-full h-52 rounded-md border bg-accent">
                        <Upload.Preview className="object-contain max-w-full max-h-full" />
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        className="absolute bottom-2 right-2 size-6"
                        onClick={() => {
                          field.onChange('');
                        }}
                      >
                        <IconTrash size={12} color="red" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload.Preview className="hidden" />
                      <Upload.Button
                        size="sm"
                        variant="secondary"
                        type="button"
                        className="flex flex-col items-center justify-center w-full gap-3 border border-dashed h-52 text-muted-foreground"
                      >
                        <IconUpload />
                        <Button variant={'outline'}>Upload Logo</Button>
                        <span className="text-sm font-medium">
                          Max size: 15MB, File type: PNG
                        </span>
                      </Upload.Button>
                    </>
                  )}
                </Upload.Root>
              </Form.Control>
              <Form.Message className="text-destructive" />
            </Form.Item>
          )}
        />
      </div>

      <Heading>Main color</Heading>
      <Form.Field
        control={control}
        name="color"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Color</Form.Label>

            <Form.Control>
              <ColorPicker
                value={field.value}
                onValueChange={field.onChange}
                className="w-24"
              />
            </Form.Control>
            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />

      <Heading>Infos</Heading>
      <Form.Field
        control={control}
        name="website"
        render={({ field }) => (
          <Form.Item>
            <Form.Label>Website</Form.Label>

            <Form.Control>
              <Input {...field} placeholder="Website url" />
            </Form.Control>
            <Form.Message className="text-destructive" />
          </Form.Item>
        )}
      />
    </PmsFormFieldsLayout>
  );
};

export default Appearance;
