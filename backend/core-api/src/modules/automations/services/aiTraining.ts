import { FileEmbeddingService } from 'erxes-api-shared/core-modules';
import { sanitizeKey } from 'erxes-api-shared/utils';
import { IModels } from '~/connectionResolvers';

export interface ITrainingProgress {
  agentId: string;
  totalFiles: number;
  processedFiles: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

export class AiTrainingService {
  private models: IModels;

  constructor(models: IModels) {
    this.models = models;
  }

  /**
   * Start AI training for an agent - embed all files
   */
  async startAiTraining(agentId: string): Promise<ITrainingProgress> {
    // Get AI agent with files
    const agent = await this.models.AiAgents.findById({ _id: agentId });
    if (!agent) {
      throw new Error('AI Agent not found');
    }

    const files = agent.files;
    if (files.length === 0) {
      throw new Error('No files found for training');
    }

    // Clear existing embeddings for this agent
    await this.models.AiEmbeddings.deleteMany({
      fileId: { $in: files.map(({ id }) => id) },
    });

    const fileEmbeddingService = new FileEmbeddingService();
    let processedFiles = 0;

    // Process each file
    for (const { id, key, name } of files) {
      try {
        // Create embedding for the file
        const fileEmbedding = await fileEmbeddingService.embedUploadedFile(
          this.models,
          sanitizeKey(key),
        );

        // Store in database
        await this.models.AiEmbeddings.create({
          fileId: id,
          fileName: name,
          key,
          bucket: 'erxes-saas',
          fileContent: fileEmbedding.fileContent,
          embedding: fileEmbedding.embedding,
          embeddingModel: 'bge-large-en-v1.5',
          dimensions: fileEmbedding.embedding.length,
        });

        processedFiles++;
      } catch (error) {
        console.error(`Failed to process file :`, error);
        // Continue with other files
      }
    }

    return {
      agentId,
      totalFiles: files.length,
      processedFiles,
      status: processedFiles === files.length ? 'completed' : 'failed',
      error:
        processedFiles < files.length
          ? 'Some files failed to process'
          : undefined,
    };
  }

  /**
   * Remove embeddings for specific files
   */
  async removeFileEmbeddings(fileIds: string[]): Promise<void> {
    await this.models.AiEmbeddings.deleteMany({
      fileId: { $in: fileIds },
    });
  }

  /**
   * Remove all embeddings for an agent
   */
  async removeAgentEmbeddings(agentId: string): Promise<void> {
    const agent = await this.models.AiAgents.findById(agentId);
    if (agent && agent.files) {
      const fileIds = agent.files.map(({ id }) => id).filter(Boolean);
      await this.removeFileEmbeddings(fileIds);
    }
  }

  /**
   * Get training status for an agent
   */
  async getTrainingStatus(agentId: string): Promise<ITrainingProgress> {
    const agent = await this.models.AiAgents.findById(agentId);
    if (!agent) {
      throw new Error('AI Agent not found');
    }

    const files = agent.files || [];
    const embeddedFiles = await this.models.AiEmbeddings.find({
      fileId: { $in: files.map(({ id }) => id) },
    });

    return {
      agentId,
      totalFiles: files.length,
      processedFiles: embeddedFiles.length,
      status: embeddedFiles.length === files.length ? 'completed' : 'pending',
    };
  }
}
