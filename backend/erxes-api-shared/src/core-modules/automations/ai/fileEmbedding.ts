import { getEnv } from '../../../utils';
import {
  embedTextCF,
  generateTextCF,
  getFileAsStringFromCF,
} from './cloudflare/utils';
export interface IFileEmbedding {
  fileId: string;
  fileName: string;
  fileContent: string;
  embedding: number[];
  createdAt: Date;
}

export const getConfigs = async (models: any) => {
  const configsMap: any = {};
  const configs = await models.Configs.find({}).lean();

  for (const config of configs) {
    configsMap[config.code] = config.value;
  }

  return configsMap;
};

export const getConfig = async (
  code: string,
  defaultValue?: string,
  models?: any,
) => {
  if (!models) {
    return getEnv({ name: code, defaultValue });
  }

  const configs = await getConfigs(models);

  const envValue = getEnv({ name: code, defaultValue });

  if (!configs[code]) {
    return envValue || defaultValue;
  }

  return configs[code];
};

export class FileEmbeddingService {
  /**
   * Embed uploaded file content and store for AI agent use
   */
  async embedUploadedFile(
    models: any,
    key: string,
    fileName?: string,
  ): Promise<IFileEmbedding> {
    try {
      // Get file content from Cloudflare R2
      const fileContent = await getFileAsStringFromCF('erxes-saas', key);

      console.log({ fileContent });

      // Generate embedding for the file content
      const embedding = await embedTextCF(fileContent);

      return {
        fileId: key,
        fileName: fileName || key,
        fileContent,
        embedding,
        createdAt: new Date(),
      };
    } catch (error) {
      throw new Error(`Failed to embed file: ${error.message}`);
    }
  }

  /**
   * Generate AI agent message based on file content and user query
   */
  async generateAgentMessage(
    fileEmbeddings: IFileEmbedding[],
    userQuery: string,
  ): Promise<string> {
    try {
      // Use Cloudflare AI for advanced semantic search and response generation
      const response = await this.generateAdvancedResponse(
        fileEmbeddings,
        userQuery,
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to generate agent message: ${error.message}`);
    }
  }

  /**
   * Advanced response generation using Cloudflare AI for semantic search and context retrieval
   */
  private async generateAdvancedResponse(
    fileEmbeddings: IFileEmbedding[],
    userQuery: string,
  ): Promise<string> {
    try {
      // Create a comprehensive prompt for advanced document analysis
      const documentContexts = fileEmbeddings
        .map((embedding, index) => {
          const cleanContent = this.cleanDocumentContent(embedding.fileContent);
          return `Document ${index + 1} (${
            embedding.fileName
          }):\n${cleanContent.substring(0, 1000)}`;
        })
        .join('\n\n');

      const advancedPrompt = `You are an enterprise-grade AI assistant with access to multiple documents. Your task is to provide comprehensive, accurate, and contextually relevant responses based on the available documentation.

Available Documents:
${documentContexts}

User Question: "${userQuery}"

Instructions:
1. Analyze all relevant documents to find the most accurate information
2. If multiple documents contain relevant information, synthesize them coherently
3. If the question cannot be answered from the documents, clearly state this
4. Provide specific, actionable information when possible
5. Cite which document(s) your information comes from
6. If the documents contain conflicting information, acknowledge this
7. Structure your response in a clear, professional manner

Please provide a comprehensive response based on the available documentation:`;

      const response = await generateTextCF(advancedPrompt);
      return response;
    } catch (error) {
      console.error('Error in advanced response generation:', error);

      // Fallback to simpler approach if advanced method fails
      return await this.generateFallbackResponse(fileEmbeddings, userQuery);
    }
  }

  /**
   * Fallback response generation for when advanced method fails
   */
  private async generateFallbackResponse(
    fileEmbeddings: IFileEmbedding[],
    userQuery: string,
  ): Promise<string> {
    try {
      // Use Cloudflare AI to find the most relevant document
      const relevancePrompt = `Given the following documents and user question, identify which document is most relevant and extract the key information needed to answer the question.

Documents:
${fileEmbeddings
  .map(
    (embedding, index) =>
      `Document ${index + 1}: ${this.cleanDocumentContent(
        embedding.fileContent,
      ).substring(0, 500)}`,
  )
  .join('\n\n')}

User Question: "${userQuery}"

Please identify the most relevant document and provide a helpful answer based on its content. If no document is relevant, state this clearly.`;

      const response = await generateTextCF(relevancePrompt);
      return response;
    } catch (error) {
      console.error('Error in fallback response generation:', error);
      return "I apologize, but I'm unable to process your question at the moment. Please try again or rephrase your question.";
    }
  }

  /**
   * Clean and process document content for better AI processing
   */
  private cleanDocumentContent(content: string): string {
    // Remove binary markers and XML tags
    let cleanText = content
      .replace(/PK[^\s]*/g, '') // Remove PK markers
      .replace(/<\?xml[^>]*>/g, '') // Remove XML declarations
      .replace(/<[^>]*>/g, '') // Remove all XML tags
      .replace(/[^\w\s.,!?\-()]/g, ' ') // Keep readable characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // If still too much binary content, try to extract meaningful text
    if (cleanText.length < 50) {
      const readablePattern = /[A-Za-z]{3,}/g;
      const words = cleanText.match(readablePattern);
      if (words && words.length > 0) {
        cleanText = words.join(' ');
      } else {
        cleanText =
          "This appears to be a binary file or document that couldn't be properly extracted.";
      }
    }

    return cleanText;
  }

  /**
   * Generate AI response using Cloudflare AI
   */
  private async generateAIResponse(
    content: string,
    userQuery: string,
  ): Promise<string> {
    try {
      // Create a prompt for the AI model
      const prompt = `Based on the following document content, please answer the user's question in a helpful and informative way. Provide a clear, concise response that directly addresses their question.Document Content:${content.substring(
        0,
        2000,
      )} // Limit content to avoid token limits
      User Question: ${userQuery}

      Please provide a helpful answer based on the document content:`;
      const response = await generateTextCF(prompt);

      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return `I apologize, but I encountered an error while processing your question. Please try again or rephrase your question.`;
    }
  }

  /**
   * Generate general response using agent's prompt and instructions
   */
  async generateGeneralResponse(
    prompt: string,
    instructions: string,
    userQuery: string,
  ): Promise<string> {
    try {
      // Create a context-aware prompt for general conversation
      const systemPrompt = `You are an AI agent with the following characteristics:
          
      ${prompt ? `Agent Prompt: ${prompt}` : ''}
      ${instructions ? `Agent Instructions: ${instructions}` : ''}
          
      Please respond to the user's message in a helpful, friendly, and contextually appropriate way. If the user is greeting you, respond warmly. If they're asking for help, provide assistance based on your capabilities. If they're asking about your role, explain what you can do.
          
      User Message: ${userQuery}
          
      Please provide a natural, conversational response:`;

      const response = await generateTextCF(systemPrompt);
      return response;
    } catch (error) {
      console.error('Error generating general response:', error);

      // Use Cloudflare AI for fallback response as well
      try {
        const fallbackPrompt = `You are a helpful AI agent. The user sent this message: "${userQuery}"

        Please provide a friendly, helpful response. If it's a greeting, respond warmly. If they're asking for help, explain what you can do. If it's unclear, ask how you can help them.
              
        User Message: ${userQuery}
              
        Please provide a natural response:`;

        const fallbackResponse = await generateTextCF(fallbackPrompt);
        return fallbackResponse;
      } catch (fallbackError) {
        console.error('Error generating fallback response:', fallbackError);
        return `Hello! I'm your AI agent. I'm here to help you with questions and tasks. How can I assist you today?`;
      }
    }
  }
}
