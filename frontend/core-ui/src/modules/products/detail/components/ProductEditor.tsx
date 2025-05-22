import type React from "react";
import { Form, Editor } from "erxes-ui";
import { Control, UseFormSetValue } from "react-hook-form";
import { ProductHotKeyScope } from "@/products/types/ProductsHotKeyScope";
import { BlockNoteUtils } from "../utils/blockNode";
import { ProductFormValues } from "@/products/constants/formSchema";

interface ProductEditorFieldProps {
  control: Control<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  name: "description" | "barcodeDescription";
  label: string;
  initialContent?: string;
  scope: ProductHotKeyScope;
}

export const ProductEditorField: React.FC<ProductEditorFieldProps> = ({
  control,
  setValue,
  name,
  label,
  initialContent,
  scope
}) => {
  const handleEditorChange = (value: string) => {
    const htmlContent = BlockNoteUtils.convertBlockNoteToHtml(value);
    setValue(name, htmlContent, { 
      shouldDirty: true, 
      shouldTouch: true, 
      shouldValidate: false 
    });
  };

  return (
    <Form.Field
      control={control}
      name={name}
      render={() => (
        <Form.Item className="mb-5">
          <Form.Label className="text-xs font-semibold text-gray-500 tracking-wider mb-1">
            {label}
          </Form.Label>
          <Form.Control>
            <Editor
              initialContent={BlockNoteUtils.formatEditorContent(initialContent)}
              onChange={handleEditorChange}
              scope={scope}
            />
          </Form.Control>
          <Form.Message className="text-destructive" />
        </Form.Item>
      )}
    />
  );
};