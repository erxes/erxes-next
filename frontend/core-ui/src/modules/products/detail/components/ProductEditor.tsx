import type React from "react";
import { Form, Editor } from "erxes-ui";
import { Control, UseFormSetValue } from "react-hook-form";
import { ProductHotKeyScope } from "@/products/types/ProductsHotKeyScope";
import { ProductFormValues } from "@/products/constants/formSchema";
import { Block } from "@blocknote/core";

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
  const handleEditorChange = async (value: string, editorInstance?: any) => {
    try {
      const blocks: Block[] = JSON.parse(value);
      if (editorInstance && editorInstance.blocksToHTMLLossy) {
        const htmlContent = await editorInstance.blocksToHTMLLossy(blocks);
        setValue(name, htmlContent, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: false
        });
      } else {
        const htmlContent = blocks
          .map((block: Block) => {
            if (block.type === "paragraph" && block.content) {
              const textContent = block.content
                .map((item: any) => item.text || "")
                .join("");
              return textContent ? `<p>${textContent}</p>` : "";
            }
            return "";
          })
          .filter(Boolean)
          .join("");
                
        setValue(name, htmlContent, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: false
        });
      }
    } catch (error) {
      setValue(name, "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false
      });
    }
  };

  const convertHTMLToBlocks = (htmlContent: string): Block[] => {
    if (!htmlContent || htmlContent.trim() === "") {
      return [{
        id: crypto.randomUUID(),
        type: "paragraph",
        props: {
          textColor: "default",
          backgroundColor: "default",
          textAlignment: "left"
        },
        content: [],
        children: []
      }];
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const blocks: Block[] = [];
    const children = Array.from(tempDiv.children);
    
    if (children.length === 0) {
      const textContent = tempDiv.textContent || tempDiv.innerText || "";
      if (textContent.trim()) {
        blocks.push({
          id: crypto.randomUUID(),
          type: "paragraph",
          props: {
            textColor: "default",
            backgroundColor: "default",
            textAlignment: "left"
          },
          content: [{
            type: "text",
            text: textContent,
            styles: {}
          }],
          children: []
        });
      }
    } else {
      children.forEach((element) => {
        const tagName = element.tagName.toLowerCase();
        const textContent = element.textContent || "";
        
        if (textContent.trim()) {
          let blockType: string = "paragraph";
          let props: any = {
            textColor: "default",
            backgroundColor: "default",
            textAlignment: "left"
          };

          if (tagName.match(/^h[1-6]$/)) {
            blockType = "heading";
            props.level = parseInt(tagName.charAt(1));
          }

          blocks.push({
            id: crypto.randomUUID(),
            type: blockType as "paragraph" | "heading",
            props,
            content: [{
              type: "text",
              text: textContent,
              styles: {}
            }],
            children: []
          });
        }
      });
    }

    return blocks.length > 0 ? blocks : [{
      id: crypto.randomUUID(),
      type: "paragraph",
      props: {
        textColor: "default",
        backgroundColor: "default",
        textAlignment: "left"
      },
      content: [],
      children: []
    }];
  };

  const formatInitialContent = (content?: string): string | undefined => {
    if (!content || content.trim() === "") {
      return undefined;
    }

    if (content.startsWith("[")) {
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          return content;
        }
      } catch (e) {
        console.error("Failed to parse initial content as JSON:", e);
      }
    }

    if (content.includes("<") && content.includes(">")) {
      const blocks = convertHTMLToBlocks(content);
      return JSON.stringify(blocks);
    }

    if (content.trim()) {
      const blocks = convertHTMLToBlocks(`<p>${content}</p>`);
      return JSON.stringify(blocks);
    }

    return undefined;
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
              initialContent={formatInitialContent(initialContent)}
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