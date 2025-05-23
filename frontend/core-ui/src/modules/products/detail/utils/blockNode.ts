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

  // Secure HTML sanitization without external libraries
  static sanitizeHtml(htmlContent: string): string {
    if (!htmlContent || typeof htmlContent !== 'string') {
      return '';
    }

    // Create a temporary DOM element to safely parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Extract only the text content, completely removing all HTML
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Additional cleanup to remove any remaining dangerous patterns
    return textContent
      .replace(/[<>]/g, '') // Remove any remaining angle brackets
      .trim();
  }

  static convertHtmlToBlockNote(htmlContent: string): string {
    if (!htmlContent || htmlContent.trim() === "") {
      return JSON.stringify([this.createEmptyBlock()]);
    }

    // Use secure sanitization instead of regex
    const sanitizedText = this.sanitizeHtml(htmlContent);
    
    if (!sanitizedText) {
      return JSON.stringify([this.createEmptyBlock()]);
    }

    return JSON.stringify([this.createTextBlock(sanitizedText)]);
  }

  static formatEditorContent(value: unknown): string {
    // If no value or undefined/null, return default
    if (!value || value === null || value === undefined) {
      return JSON.stringify([this.createEmptyBlock()]);
    }
    
    // If it's a string
    if (typeof value === "string") {
      // More robust check for BlockNote JSON format
      if (value.startsWith("[")) {
        try {
          const parsed = JSON.parse(value);
          // Verify it's actually BlockNote format by checking structure
          if (Array.isArray(parsed) && 
              parsed.length > 0 && 
              parsed.every(block => 
                typeof block === 'object' && 
                block !== null && 
                'type' in block && 
                block.type === "paragraph" && 
                'content' in block
              )) {
            return value;
          }
          // Not valid BlockNote format, fall through to other handlers
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