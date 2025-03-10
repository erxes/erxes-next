export interface TextContent {
    type: 'text';
    text: string;
    styles: Record<string, any>;
  }
  
  export interface Block {
    id: string;
    type: string;
    props?: {
      textColor?: string;
      backgroundColor?: string;
      textAlignment?: string;
    };
    content: TextContent[] | string;
    children: Block[];
  }
  
  export interface DescriptionInputProps {
    initialContent?: string;
    onSave?: (text: string) => void;
    placeholder?: string;
  }
  
  export interface BlockEditorType {
    document: Block[];
    tryParseMarkdownToBlocks: (markdown: string) => Promise<Block[]>;
    replaceBlocks: (targetBlocks: Block[], newBlocks: Block[]) => void;
  }
  