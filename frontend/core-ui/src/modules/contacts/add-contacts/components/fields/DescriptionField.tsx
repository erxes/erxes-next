import { Control } from 'react-hook-form';

import { Form } from 'erxes-ui';

import { CustomerFormType } from '@/contacts/add-contacts/components/formSchema';
import { BlockEditor } from 'erxes-ui/components';
import { useCreateBlockNote } from '@blocknote/react';
import { BLOCK_SCHEMA } from 'erxes-ui/modules/blocks/constant/blockEditorSchema';
import { usePreviousHotkeyScope } from 'erxes-ui/modules/hotkey/hooks/usePreviousHotkeyScope';
import { ContactHotKeyScope } from '@/contacts/types/ContactHotKeyScope';
import { useScopedHotkeys } from 'erxes-ui/modules/hotkey/hooks/useScopedHotkeys';
import { Key } from 'erxes-ui/types/Key';
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
