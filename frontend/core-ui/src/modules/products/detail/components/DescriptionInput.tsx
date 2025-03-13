import {
  IconArrowUp,
  IconCommand,
  IconCornerDownLeft,
} from "@tabler/icons-react";
import {
  BlockEditor,
  Button,
  cn,
  useBlockEditor,
} from "erxes-ui";
import { Kbd } from "erxes-ui/components/kbd";
import { useCallback, useEffect } from "react";
import { Block, BlockEditorType, DescriptionInputProps } from "../types/descriptionTypes";

export const DescriptionInput = ({
  initialContent,
  onSave,
  placeholder = "Enter description...",
}: DescriptionInputProps) => {
  const editor = useBlockEditor() as BlockEditorType;

  useEffect(() => {
    async function loadInitialContent() {
      if (initialContent) {
        try {
          const blocks = await editor.tryParseMarkdownToBlocks(initialContent);
          editor.replaceBlocks(editor.document, blocks);
        } catch {
          try {
            const parsedContent = JSON.parse(initialContent) as Block[];
            editor.replaceBlocks(editor.document, parsedContent);
          } catch (error) {
            console.warn("Parsing failed for both Markdown and JSON:", error);
            const fallbackBlock: Block[] = [
              {
                id: "initial-block",
                type: "paragraph",
                content: initialContent || "",
                children: [],
              },
            ];
            editor.replaceBlocks(editor.document, fallbackBlock);
          }
        }
      }
    }

    loadInitialContent();
  }, [initialContent, editor]);

  function extractTextFromBlocks(blocks: Block[]): string[] {
    const visited = new Set<Block>();
    const queue = [...blocks];
    const texts: string[] = [];

    while (queue.length > 0) {
      const block = queue.shift()!;
      if (visited.has(block)) continue;
      visited.add(block);

      if (Array.isArray(block.content)) {
        block.content.forEach(item => {
          if (item.type === 'text' && item.text) {
            texts.push(item.text);
          }
        });
      } else if (typeof block.content === 'string') {
        texts.push(block.content);
      }

      if (block.children?.length) {
        queue.push(...block.children);
      }
    }

    return texts;
  }

  const handleSave = useCallback(() => {
    if (onSave) {
      const extractedText = extractTextFromBlocks(editor.document);
      const plainText = extractedText.join('\n');
      onSave(plainText);
    }
  }, [onSave, editor.document]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        handleSave();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleSave]);

  return (
    <div className={cn("flex flex-col h-full py-4 gap-1")}>
      <BlockEditor
        editor={editor}
        placeholder={placeholder}
        className={cn("h-full w-full overflow-y-auto")}
      />
      <div className="flex px-6 gap-4">
        <Button size="lg" className="ml-auto" onClick={handleSave}>
          <IconArrowUp />
          Send
          <Kbd className="ml-1">
            <IconCommand size={12} />
            <IconCornerDownLeft size={12} />
          </Kbd>
        </Button>
      </div>
    </div>
  );
};