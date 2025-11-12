export interface RagUploadResponse {
  message: string;
  org_id: string;
}

export interface RagAskResponse {
  answer: string;
  source_documents: string[];
  org_id: string;
}

export interface RagInteraction {
  _id: string;
  question: string;
  answer: string;
  sourceDocuments?: string[];
  userId: string;
  orgId: string;
  createdAt: Date;
}

export interface GeneralSettings {
  assistantName: string;
  conversationStarter: string;
  description: string;
  promptSuggestions?: string[];
}

export interface UpdateGeneralSettingsResponse {
  message: string;
  success: boolean;
  settings: GeneralSettings;
}


export interface SystemPrompt {
  _id: string;
  orgId: string;
  prompt: string;
  updatedAt: string;
}

export interface UpdateSystemPromptResponse {
  _id: string;
  orgId: string;
  prompt: string;
  updatedAt: string;
}
