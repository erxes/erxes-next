import {
    Form,
    Upload,
    FormLabel,
    Input,
    Button,
    FormField,
    FormItem,
    FormControl,
    Switch,
    FormDescription,
    DatePicker,
    ToggleGroup,
    ToggleGroupItem,
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from 'erxes-ui/components';
import { SubmitHandler } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import { useProfile } from '@/settings/profile/hooks/useProfile';
import { FormType, useProfileForm } from '@/settings/profile/hooks/useProfileForm';
import { PROFILE_ADVANCED_FIELDS, PROFILE_LINK_FIELDS } from '../constants/profileFields';
import { ChevronDown } from 'lucide-react';

const ProfileForm = () => {

    const [moreView, setMoreView] = useState<boolean>(false)
    const [currentLink, setCurrentLink] = useState<string>('');

    const { profile, loading, refetch, profileUpdate } = useProfile()

    const { form } = useProfileForm(profile)

    useEffect(() => {
        if (!loading) {
            form.reset(profile || {})
        }
    }, [
        loading,
        refetch,
    ])

    const submitHandler: SubmitHandler<FormType> = useCallback(
        async (data) => {
            profileUpdate(data);
        },
        [profileUpdate]
    );

    const handlePasswordChange = () => {

    }

    const renderField = ({ field, element, attributes }) => {
        switch (element) {
            case 'input':
                return <Input {...field} {...attributes} />
            case 'select':
                // <Select placeholder={`Select ${attributes.placeholder}`} {...attributes} />
                return <></>
            case 'date':
                return <DatePicker {...field} {...attributes} />
            default:
                return <></>
        }
    }

    const renderFormField = ({ name, element, attributes }: {
        name: keyof FormType,
        element: string,
        attributes: Record<string, unknown>,
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
        )
    }

    const renderDetaulFields = () => {

        return (
            <div className="grid grid-cols-2 gap-6 mt-0.5">
                <div className="flex flex-col gap-2">
                    <FormLabel className="text-xs">First Name</FormLabel>
                    {renderFormField({ name: 'details.firstName' as keyof FormType, element: 'input', attributes: { type: 'text', placeholder: "Enter First Name" } })}
                </div>
                <div className="flex flex-col gap-2">
                    <FormLabel className="text-xs">Last Name</FormLabel>
                    {renderFormField({ name: 'details.lastName' as keyof FormType, element: 'input', attributes: { type: 'text', placeholder: "Enter Last Name" } })}
                </div>
            </div>
        )
    }

    const renderAdvancedFields = () => {

        return (
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem className="py-0 border-b-0" value='advanced'>
                    <AccordionTrigger className="flex flex-1 items-center justify-between py-0 text-left font-normal leading-6 transition-all [&[data-state=open]>svg]:rotate-180 hover:no-underline">
                        <div className="flex flex-col gap-3">
                            <FormLabel>More Information</FormLabel>
                            <FormDescription>Provide any relevant additional personal information, if applicable.</FormDescription>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="py-3 gap-3">
                        <div className="grid grid-cols-2 gap-6 mt-0.5">
                            {PROFILE_ADVANCED_FIELDS.map((advancedField, index) => {
                                const { fieldLabel, fieldName, fieldPath, field: { element, attributes = {} } } = advancedField

                                const pathName = fieldPath ? [fieldPath, fieldName].join('.') : fieldName

                                return (
                                    <div className="flex flex-col gap-2" key={`advanced-field-${index}`}>
                                        <FormLabel className="text-xs">{fieldLabel}</FormLabel>
                                        {renderFormField({ name: pathName as keyof FormType, element, attributes })}
                                    </div>
                                )
                            })}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        )
    }

    const renderLinkFields = () => {

        return (
            <>
                <FormDescription>
                    This is your social links.
                </FormDescription>
                <div className='flex gap-1'>
                    <ToggleGroup type="single" variant="outline" size={'sm'} onValueChange={(selectedItem) => {
                        setCurrentLink(selectedItem)
                    }}>
                        {
                            PROFILE_LINK_FIELDS.map((linkField, index) => {

                                const { fieldName, fieldPath, icon: Icon } = linkField;

                                const field = form.getFieldState([fieldPath, fieldName].join('.') as keyof FormType)

                                return (
                                    <ToggleGroupItem value={fieldName} aria-label="Toggle bold" key={`toggle-item-${index}`} className={`${field.error && 'border-rose-600'}`} onDoubleClick={() => {
                                        const url = form.getValues([fieldPath, fieldName].join('.') as keyof FormType)

                                        if (typeof url === 'string' && url) {
                                            window.open(url, '_blank');
                                        }
                                    }}>
                                        <Icon className={`h-4 w-4 ${field.error && 'text-rose-600'}`} />
                                    </ToggleGroupItem>
                                )
                            })
                        }
                    </ToggleGroup>

                    {currentLink && <div className='flex-grow'>{renderFormField({ name: `links.${currentLink}` as keyof FormType, element: 'input', attributes: { type: "text", placeholder: `Enter ${currentLink} link` } })}</div>}
                </div>
            </>
        )
    }

    const renderFooter = () => {
        return (
            <div className='flex justify-between'>
                <div className="mt-1">
                    <Button size="sm" variant="outline" type='button' onClick={() => handlePasswordChange()}>
                        Change password
                    </Button>

                </div>
                <div className="mt-1">
                    <Button
                        type="submit"
                        size="sm"
                    >
                        Update
                    </Button>
                </div>
            </div>
        )
    }

    if (loading) {
        return <></>;
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(submitHandler)}
                className="grid gap-5"
            >
                <div className="flex flex-col gap-4">
                    <FormLabel>Profile picture</FormLabel>
                    <Upload.Root>
                        <Upload.Preview />
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-4">
                                <Upload.Button size="sm" variant="outline" />
                                <Upload.RemoveButton size="sm" variant="outline" />
                            </div>
                            <FormDescription>
                                Upload a profile picture to help identify you.
                            </FormDescription>
                        </div>
                    </Upload.Root>
                </div>
                <div className="flex flex-col gap-3">
                    <FormLabel>Name</FormLabel>
                    <FormDescription>
                        This is your public display name.
                    </FormDescription>
                    {renderDetaulFields()}
                </div>
                <div className="flex flex-col gap-3">
                    <FormLabel>Email</FormLabel>
                    <FormDescription>
                        This is your public email address.
                    </FormDescription>
                    {renderFormField({ name: 'email', element: 'input', attributes: { type: "email", placeholder: "Enter email" } })}
                </div>
                <div className="flex flex-col gap-3">

                    {renderAdvancedFields()}
                </div>
                <div className="flex flex-col gap-3">
                    <FormLabel>Links</FormLabel>
                    {renderLinkFields()}
                </div>
                <div className="flex flex-col gap-3">
                    <FormLabel>Change Password</FormLabel>
                    <FormDescription>
                        Receive an email containing password update link
                    </FormDescription>
                    {renderFooter()}
                </div>
            </form>
        </Form>
    )
}

export default ProfileForm