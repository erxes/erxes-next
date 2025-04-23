import { Control } from 'react-hook-form';

import {
  BlockEditor,
  Form,
  // BLOCK_SCHEMA,
  usePreviousHotkeyScope,
  useScopedHotkeys,
  Key,
  useBlockEditor,
} from 'erxes-ui';

// import { useCreateBlockNote } from '@blocknote/react';
import { CourseFormType } from '@/courses/add-course/components/formSchema';
import { CourseHotKeyScope } from '@/courses/types/CourseHotKeyScope';

import { useRef } from 'react';

export const DescriptionField = ({
  control,
}: {
  control: Control<CourseFormType>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useBlockEditor();
  const {
    goBackToPreviousHotkeyScope,
    // setHotkeyScopeAndMemorizePreviousScope,
  } = usePreviousHotkeyScope();

  useScopedHotkeys(
    `${Key.Escape}`,
    () => {
      if (ref.current) {
        ref.current.focus();
        goBackToPreviousHotkeyScope();
      }
    },
    CourseHotKeyScope.CourseAddSheetDescriptionField,
  );

  return (
    <Form.Field
      control={control}
      name="description"
      render={({ field }) => (
        <Form.Item className="mb-5">
          <Form.Label>DESCRIPTION</Form.Label>

          {/* <Form.Control> */}
          <BlockEditor
            editor={editor}
            onChange={field.onChange}
            // onBlur={goBackToPreviousHotkeyScope}
            // onFocus={() =>
            //   setHotkeyScopeAndMemorizePreviousScope(
            //     CourseHotKeyScope.CourseAddSheetDescriptionField,
            //   )
            // }
            variant="outline"
            className="h-28 rounded-md min-h-28 overflow-y-auto"
          />
          {/* </Form.Control> */}
          <Form.Message className="text-destructive" />
          <div ref={ref} tabIndex={-1} />
        </Form.Item>
      )}
    />
  );
};
