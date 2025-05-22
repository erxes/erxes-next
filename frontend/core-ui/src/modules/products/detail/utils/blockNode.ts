import { BlockNoteBlock, BlockNoteContent, BlockNoteDocument } from "../types/detailTypes";

export class BlockNoteUtils {
  static generateId(): string {
    return crypto.randomUUID();
  }

  static createEmptyBlock(): BlockNoteBlock {
    return {
      id: this.generateId(),
      type: "paragraph",
      props: {
        textColor: "default",
        backgroundColor: "default",
        textAlignment: "left"
      },
      content: [],
      children: []
    };
  }

  static createTextBlock(text: string): BlockNoteBlock {
    return {
      id: this.generateId(),
      type: "paragraph",
      props: {
        textColor: "default",
        backgroundColor: "default",
        textAlignment: "left"
      },
      content: [
        {
          type: "text",
          text,
          styles: {}
        }
      ],
      children: []
    };
  }

  static convertHtmlToBlockNote(htmlContent: string): string {
    if (!htmlContent || htmlContent.trim() === "") {
      return JSON.stringify([this.createEmptyBlock()]);
    }

    // Remove HTML tags and extract text content
    const textContent = htmlContent.replace(/<[^>]*>/g, "").trim();
    
    if (!textContent) {
      return JSON.stringify([this.createEmptyBlock()]);
    }

    return JSON.stringify([this.createTextBlock(textContent)]);
  }

  static formatEditorContent(value: unknown): string {
    // If no value or undefined/null, return default
    if (!value || value === null || value === undefined) {
      return JSON.stringify([this.createEmptyBlock()]);
    }
    
    // If it's a string
    if (typeof value === "string") {
      // If it's already BlockNote JSON format, return as is
      if (value.startsWith("[") && value.includes('"type":"paragraph"')) {
        try {
          JSON.parse(value); // Validate JSON
          return value;
        } catch (e) {
          // Invalid JSON, treat as HTML below
        }
      }
      
      // If it's HTML content, convert to BlockNote format
      if (value.includes("<") || value.includes(">")) {
        return this.convertHtmlToBlockNote(value);
      }
      
      // If it's plain text, convert to BlockNote format
      if (value.trim()) {
        return this.convertHtmlToBlockNote(`<p>${value}</p>`);
      }
    }
    
    // If it's an array, try to use it directly
    if (Array.isArray(value) && value.length > 0) {
      try {
        return JSON.stringify(value);
      } catch (e) {
        // Fallback to default
      }
    }
    
    // For any other case, return default
    return JSON.stringify([this.createEmptyBlock()]);
  }

  static convertBlockNoteToHtml(jsonContent: string): string {
    try {
      const blocks: BlockNoteDocument = JSON.parse(jsonContent);
      
      if (!Array.isArray(blocks) || blocks.length === 0) {
        return "";
      }
      
      return blocks
        .map((block: BlockNoteBlock) => {
          if (block.type === "paragraph") {
            const textContent = block.content
              ?.map((item: BlockNoteContent) => item.text || "")
              .join("") || "";
            return textContent ? `<p>${textContent}</p>` : "";
          }
          // Add more block types as needed
          return "";
        })
        .filter(Boolean)
        .join("");
    } catch (e) {
      console.error("Error converting BlockNote to HTML:", e);
      return "";
    }
  }
}