import { useCallback, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  DatePicker,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  Input,
  ToggleGroup,
  ToggleGroupItem,
  Upload,
} from 'erxes-ui/components';

import {
  PROFILE_ADVANCED_FIELDS,
  PROFILE_LINK_FIELDS,
} from '@/settings/profile/constants/profileFields';
import { useProfile } from '@/settings/profile/hooks/useProfile';
import {
  FormType,
  useProfileForm,
} from '@/settings/profile/hooks/useProfileForm';

export const ProfileForm = () => {
  const [currentLink, setCurrentLink] = useState<string>('');

  const { form, onCompleted } = useProfileForm();

  const { loading, profileUpdate } = useProfile({ onCompleted });

  const submitHandler: SubmitHandler<FormType> = useCallback(
    async (data) => {
      profileUpdate(data);
    },
    [profileUpdate]
  );

  const renderField = ({ field, element, attributes }) => {
    const fieldState = form.getFieldState(field.name);

    switch (element) {
      case 'input':
        return (
          <Input
            {...field}
            {...attributes}
            className={`${fieldState.error && ' focus-visible:ring-red-500'}`}
          />
        );
      case 'date':
        return <DatePicker {...field} {...attributes} />;
      default:
        return <></>;
    }
  };

  const renderFormField = ({
    name,
    element,
    attributes,
  }: {
    name: keyof FormType;
    element: string;
    attributes: Record<string, unknown>;
  }) => {
    return (
      <FormField
        key={name}
        name={name}
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              {renderField({ field, element, attributes })}
            </FormControl>
          </FormItem>
        )}
      />
    );
  };

  const renderDefaultFields = () => {
    return (
      <div className="grid grid-cols-2 gap-6 mt-0.5">
        <div className="flex flex-col gap-2">
          <FormLabel className="text-xs">First Name</FormLabel>
          {renderFormField({
            name: 'details.firstName' as keyof FormType,
            element: 'input',
            attributes: { type: 'text', placeholder: 'Enter First Name' },
          })}
        </div>
        <div className="flex flex-col gap-2">
          <FormLabel className="text-xs">Last Name</FormLabel>
          {renderFormField({
            name: 'details.lastName' as keyof FormType,
            element: 'input',
            attributes: { type: 'text', placeholder: 'Enter Last Name' },
          })}
        </div>
      </div>
    );
  };

  const renderAdvancedFields = () => {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem className="py-0 border-b-0" value="advanced">
          <AccordionTrigger className="flex flex-1 items-center justify-between py-0 text-left font-normal leading-6 transition-all [&[data-state=open]>svg]:rotate-180 hover:no-underline">
            <div className="flex flex-col gap-3">
              <FormLabel>More Information</FormLabel>
              <FormDescription>
                Provide any relevant additional personal information, if
                applicable.
              </FormDescription>
            </div>
          </AccordionTrigger>
          <AccordionContent className="py-3 gap-3">
            <div className="grid grid-cols-2 gap-6 mx-0.5">
              {PROFILE_ADVANCED_FIELDS.map((advancedField, index) => {
                const {
                  fieldLabel,
                  fieldName,
                  fieldPath,
                  field: { element, attributes = {} },
                } = advancedField;

                const pathName = fieldPath
                  ? [fieldPath, fieldName].join('.')
                  : fieldName;

                return (
                  <div
                    className="flex flex-col gap-2"
                    key={`advanced-field-${index}`}
                  >
                    <FormLabel className="text-xs">{fieldLabel}</FormLabel>
                    {renderFormField({
                      name: pathName as keyof FormType,
                      element,
                      attributes,
                    })}
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };

  const renderLinkFields = () => {
    return (
      <div className="flex gap-1">
        <ToggleGroup
          type="single"
          variant="outline"
          size={'sm'}
          onValueChange={(selectedItem) => {
            setCurrentLink(selectedItem);
          }}
        >
          {PROFILE_LINK_FIELDS.map((linkField, index) => {
            const { fieldName, fieldPath, icon: Icon } = linkField;

            const field = form.getFieldState(
              [fieldPath, fieldName].join('.') as keyof FormType
            );

            return (
              <ToggleGroupItem
                value={fieldName}
                aria-label="Toggle bold"
                key={`toggle-item-${index}`}
                className={`${field.error && 'border-red-500'}`}
                onDoubleClick={() => {
                  const url = form.getValues(
                    [fieldPath, fieldName].join('.') as keyof FormType
                  );

                  if (typeof url === 'string' && url) {
                    window.open(url, '_blank');
                  }
                }}
              >
                <Icon className={`h-4 w-4 ${field.error && 'text-rose-600'}`} />
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>

        {currentLink && (
          <div className="flex-grow">
            {renderFormField({
              name: `links.${currentLink}` as keyof FormType,
              element: 'input',
              attributes: { type: 'text', placeholder: `Enter ${currentLink}` },
            })}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <></>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)} className="grid gap-5">
        <div className="flex flex-col gap-4">
          <FormLabel>Profile picture</FormLabel>
          <FormField
            name="details.avatar"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Upload.Root
                    {...field}
                    onChange={(fileInfo) => field.onChange(fileInfo.url)}
                  >
                    <Upload.Preview />
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-4">
                        <Upload.Button
                          size="sm"
                          variant="outline"
                          type="button"
                        />
                        <Upload.RemoveButton
                          size="sm"
                          variant="outline"
                          type="button"
                        />
                      </div>
                      <FormDescription>
                        Upload a profile picture to help identify you.
                      </FormDescription>
                    </div>
                  </Upload.Root>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-3">
          <FormLabel>Name</FormLabel>
          <FormDescription>This is your public display name.</FormDescription>
          {renderDefaultFields()}
        </div>
        <div className="flex flex-col gap-3">
          <FormLabel>Email</FormLabel>
          <FormDescription>This is your public email address.</FormDescription>
          {renderFormField({
            name: 'email',
            element: 'input',
            attributes: { type: 'email', placeholder: 'Enter email' },
          })}
        </div>
        <div className="flex flex-col gap-3">{renderAdvancedFields()}</div>
        <div className="flex flex-col flex-1 gap-3">
          <FormLabel>Links</FormLabel>
          <FormDescription>This is your social links.</FormDescription>
          {renderLinkFields()}
        </div>
        <div className="w-full flex justify-end">
          <Button type="submit" size="sm">
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};
