import { useState } from 'react';
import { ValidationDisplay } from 'erxes-ui/components/display/ValidationDisplay';
import { useCustomerEdit } from '@/contacts/hooks/useEditCustomer';
import { EMAIL_VALIDATION_STATUS_INFOS } from 'erxes-ui/constants/EmailValidationStatusInfos';
import { RecordTableInlineCell } from 'erxes-ui/modules/record-table/record-table-cell/components/RecordTableInlineCell';
import { TextFieldInput } from 'erxes-ui/modules/record-field/meta-inputs/components/TextFieldInput';
import EmailVerificationInput from 'erxes-ui/modules/record-field/meta-inputs/components/EmailVerificationInput';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from 'erxes-ui/lib';

const emailSchema = z.object({
  email: z.string().email('Invalid email format').or(z.literal('')),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface ContactEmailColumnCellProps {
  cell: any;
}

export const ContactEmailColumnCell = ({
  cell,
}: ContactEmailColumnCellProps) => {
  const initialEmailValue = cell.getValue();
  const [emailValue, setEmailValue] = useState(initialEmailValue);
  const [validationStatus, setValidationStatus] = useState(
    cell.row.original.emailValidationStatus,
  );
  const { customerEdit } = useCustomerEdit();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
    defaultValues: {
      email: initialEmailValue,
    },
  });

  const emailFieldValue = watch('email');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue('email', newValue, { shouldValidate: true });
    setEmailValue(newValue);
  };

  const onSave = () => {
    const validation = emailSchema.safeParse({ email: emailValue });
    if (validation.success) {
      customerEdit({
        variables: {
          id: cell.row.original._id,
          primaryEmail: emailValue,
        },
      });
    } else {
      setEmailValue(initialEmailValue);
    }
  };

  return (
    <RecordTableInlineCell
      onSave={onSave}
      getValue={() => cell.getValue()}
      value={emailValue}
      display={() => (
        <div className="flex items-center gap-2 ml-2">
          {emailValue && (
            <ValidationDisplay
              validationInfos={EMAIL_VALIDATION_STATUS_INFOS}
              value={validationStatus || null}
            />
          )}
          <span>{emailValue}</span>
        </div>
      )}
      edit={({ setIsInEditMode }) => {
        const onSubmit = handleSubmit(() => {
          if (isValid) {
            setIsInEditMode(false);
          }
        });

        return (
          <form onSubmit={onSubmit}>
            <div className="flex flex-col">
              <div className="flex border border-border">
                {emailValue && (
                  <EmailVerificationInput
                    className="ring-0 outline-none focus:z-50 border-none h-full shadow-none rounded-none hover:bg-muted"
                    value={validationStatus || null}
                    inputValue={emailValue}
                    onChange={(newStatus) => {
                      setValidationStatus(newStatus);
                      customerEdit({
                        variables: {
                          id: cell.row.original._id,
                          emailValidationStatus: newStatus,
                        },
                      });
                    }}
                  />
                )}
                <TextFieldInput
                  value={emailFieldValue}
                  onChange={handleChange}
                  className={cn('h-full border-border border-l shadow-none')}
                />
              </div>
            </div>
          </form>
        );
      }}
    />
  );
};
