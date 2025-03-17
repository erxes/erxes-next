import { Control } from 'react-hook-form';

import {
  BlockEditor,
  Form,
  BLOCK_SCHEMA,
  usePreviousHotkeyScope,
  useScopedHotkeys,
  Key,
} from 'erxes-ui';

import { CustomerFormType } from '@/contacts/add-contacts/components/formSchema';
import { useCreateBlockNote } from '@blocknote/react';
import { ContactHotKeyScope } from '@/contacts/types/ContactHotKeyScope';
import { useRef } from 'react';

export const DescriptionField = ({
  control,
}: {
  control: Control<CustomerFormType>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useCreateBlockNote({
    schema: BLOCK_SCHEMA,
  });
  const {
    goBackToPreviousHotkeyScope,
    setHotkeyScopeAndMemorizePreviousScope,
  } = usePreviousHotkeyScope();

  useScopedHotkeys(
    `${Key.Escape}`,
    () => {
      if (ref.current) {
        ref.current.focus();
        goBackToPreviousHotkeyScope();
      }
    },
    ContactHotKeyScope.CustomerAddSheetDescriptionField,
  );

  return (
    <Form.Field
      control={control}
      name="description"
      render={({ field }) => (
        <Form.Item className="mb-5">
          <Form.Label>DESCRIPTION</Form.Label>

          <Form.Control>
            <BlockEditor
              editor={editor}
              onChange={() => field.onChange()}
              onBlur={goBackToPreviousHotkeyScope}
              onFocus={() =>
                setHotkeyScopeAndMemorizePreviousScope(
                  ContactHotKeyScope.CustomerAddSheetDescriptionField,
                )
              }
              variant="outline"
              className="h-28 rounded-md min-h-28 overflow-y-auto"
            />
          </Form.Control>
          <Form.Message className="text-destructive" />
          <div ref={ref} tabIndex={-1} />
        </Form.Item>
      )}
    />
  );
};
