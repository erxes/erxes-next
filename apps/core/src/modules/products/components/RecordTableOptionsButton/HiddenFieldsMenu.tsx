import { IconChevronLeft } from '@tabler/icons-react';

import { IconEye } from '@tabler/icons-react';
import { DropdownMenu, Button } from 'erxes-ui/components';

import { useRecoilState } from 'recoil';
import { fieldsState } from 'erxes-ui/states/RecordTableFieldsState';
export const HiddenFieldsMenu = ({ handleToFields }) => {
  const [fields, setFields] = useRecoilState(fieldsState);
  const handleFieldToggleVisibility = (
    fieldId: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    setFields((currentFields) =>
      currentFields.map((field) =>
        field.id === fieldId ? { ...field, isVisible: !field.isVisible } : field
      )
    );
  };
  return (
    <>
      <DropdownMenu.Label className="flex items-center gap-2 p-0">
        <Button
          variant={'ghost'}
          onClick={(e) => {
            handleToFields(e as unknown as React.MouseEvent);
          }}
        >
          <IconChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-foreground font-semibold">Hidden Fields</span>
      </DropdownMenu.Label>
      <DropdownMenu.Separator className="h-[0.8px]" />
      {fields
        .filter((field) => !field.isVisible)
        .map((field) => (
          <DropdownMenu.Item
            key={field.id}
            className="group cursor-pointer flex justify-between items-center p-1"
          >
            <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0">
              {field.icon && <field.icon className=" w-4 h-4" />}
              <span className="text-muted-foreground">{field.name}</span>
            </div>
            <Button
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-muted-foreground/10"
              onClick={(e) => handleFieldToggleVisibility(field.id, e)}
            >
              <IconEye />
            </Button>
          </DropdownMenu.Item>
        ))}
    </>
  );
};
