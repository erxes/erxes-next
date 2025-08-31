import {
  IAutomation,
  IAutomationDoc,
  AUTOMATION_STATUSES,
  embedTextCF,
  FileEmbeddingService,
} from 'erxes-api-shared/core-modules';
import { IContext } from '~/connectionResolvers';
import { detectConversationType } from '~/modules/automations/graphql/resolvers/utils';
import { AiTrainingService } from '~/modules/automations/services/aiTraining';

export interface IAutomationsEdit extends IAutomation {
  _id: string;
}

export const automationMutations = {
  /**
   * Creates a new automation
   */
  async automationsAdd(
    _root,
    doc: IAutomation,
    { user, models, subdomain }: IContext,
  ) {
    const automation = await models.Automations.create({
      ...doc,
      createdAt: new Date(),
      createdBy: user._id,
      updatedBy: user._id,
    });

    return models.Automations.getAutomation(automation._id);
  },

  /**
   * Updates a automation
   */
  async automationsEdit(
    _root,
    { _id, ...doc }: IAutomationsEdit,
    { user, models, subdomain }: IContext,
  ) {
    const automation = await models.Automations.getAutomation(_id);

    const updated = await models.Automations.updateOne(
      { _id },
      { $set: { ...doc, updatedAt: new Date(), updatedBy: user._id } },
    );

    return models.Automations.getAutomation(_id);
  },

  /**
   * Archive automations
   */

  async archiveAutomations(
    _root,
    { automationIds, isRestore },
    { models }: IContext,
  ) {
    await models.Automations.updateMany(
      { _id: { $in: automationIds } },
      {
        $set: {
          status: isRestore
            ? AUTOMATION_STATUSES.DRAFT
            : AUTOMATION_STATUSES.ARCHIVED,
        },
      },
    );
    return automationIds;
  },

  /**
   * Save as a template
   */
  async automationsSaveAsTemplate(
    _root,
    {
      _id,
      name,
      duplicate,
    }: { _id: string; name?: string; duplicate?: boolean },
    { user, models }: IContext,
  ) {
    const automation = await models.Automations.getAutomation(_id);

    const automationDoc: IAutomationDoc = {
      ...automation,
      createdAt: new Date(),
      createdBy: user._id,
      updatedBy: user._id,
    };

    if (name) {
      automationDoc.name = name;
    }

    if (duplicate) {
      automationDoc.name = `${automationDoc.name} duplicated`;
    } else {
      automationDoc.status = 'template';
    }

    delete automationDoc._id;

    const created = await models.Automations.create({
      ...automationDoc,
    });

    return await models.Automations.getAutomation(created._id);
  },

  /**
   * Save as a template
   */
  async automationsCreateFromTemplate(
    _root,
    { _id }: { _id: string },
    { user, models, subdomain }: IContext,
  ) {
    const automation = await models.Automations.getAutomation(_id);

    if (automation.status !== 'template') {
      throw new Error('Not template');
    }

    const automationDoc: IAutomationDoc = {
      ...automation,
      status: 'template',
      name: (automation.name += ' from template'),
      createdAt: new Date(),
      createdBy: user._id,
      updatedBy: user._id,
    };

    delete automationDoc._id;

    const created = await models.Automations.create({
      ...automationDoc,
    });

    return await models.Automations.getAutomation(created._id);
  },

  /**
   * Removes automations
   */
  async automationsRemove(
    _root,
    { automationIds }: { automationIds: string[] },
    { models }: IContext,
  ) {
    const automations = await models.Automations.find({
      _id: { $in: automationIds },
    });

    let segmentIds: string[] = [];

    for (const automation of automations) {
      const { triggers, actions } = automation;

      const triggerIds = triggers.map((trigger) => {
        return trigger.config.contentId;
      });

      const actionIds = actions.map((action) => {
        return action.config.contentId;
      });

      segmentIds = [...triggerIds, ...actionIds];
    }

    await models.Automations.deleteMany({ _id: { $in: automationIds } });
    await models.AutomationExecutions.removeExecutions(automationIds);

    for (const segmentId of segmentIds || []) {
      //   sendSegmentsMessage({
      //     subdomain: '',
      //     action: 'removeSegment',
      //     data: { segmentId }
      //   });
    }

    return automationIds;
  },

  async automationsAiAgentAdd(_root, doc, { models }: IContext) {
    return await models.AiAgents.create(doc);
  },
  async automationsAiAgentEdit(_root, { _id, ...doc }, { models }: IContext) {
    return await models.AiAgents.updateOne({ _id }, { $set: { ...doc } });
  },

  async startAiTraining(_root, { agentId }, { models }: IContext) {
    const trainingService = new AiTrainingService(models);
    return await trainingService.startAiTraining(agentId);
  },

  async getTrainingStatus(_root, { agentId }, { models }: IContext) {
    const trainingService = new AiTrainingService(models);
    return await trainingService.getTrainingStatus(agentId);
  },

  async generateAgentMessage(
    _root,
    { agentId, question },
    { models }: IContext,
  ) {
    // Get AI agent
    const agent = await models.AiAgents.findById(agentId);
    if (!agent) {
      throw new Error('AI Agent not found');
    }

    // Import the FileEmbeddingService
    const { FileEmbeddingService } = await import(
      'erxes-api-shared/core-modules'
    );
    const fileEmbeddingService = new FileEmbeddingService();

    // Use Cloudflare AI to determine if this is general conversation or file-specific
    const isGeneralConversation = await detectConversationType(question);

    if (isGeneralConversation) {
      // Use agent's prompt and instructions for general conversation
      const message = await fileEmbeddingService.generateGeneralResponse(
        agent.prompt || '',
        agent.instructions || '',
        question,
      );

      return {
        message,
        relevantFile: null,
        similarity: 0,
      };
    } else {
      // Use file embeddings for specific questions
      const files = agent.files || [];
      const fileIds = files.map((f) => f.id).filter(Boolean);

      if (fileIds.length === 0) {
        return {
          message:
            "I don't have any files to reference for this question. Please upload files and start training, or ask me a general question.",
          relevantFile: null,
          similarity: 0,
        };
      }

      const fileEmbeddings = await models.AiEmbeddings.find({
        fileId: { $in: fileIds },
      });

      if (fileEmbeddings.length === 0) {
        return {
          message:
            "I don't have any trained files to reference for this question. Please start AI training first, or ask me a general question.",
          relevantFile: null,
          similarity: 0,
        };
      }

      // Convert to IFileEmbedding format
      const embeddings = fileEmbeddings.map((embedding) => ({
        fileId: embedding.fileId,
        fileName: embedding.fileName,
        fileContent: embedding.fileContent,
        embedding: embedding.embedding,
        createdAt: embedding.createdAt,
      }));

      // Generate agent message based on files
      const message = await fileEmbeddingService.generateAgentMessage(
        embeddings,
        question,
      );

      return {
        message,
        relevantFile: fileEmbeddings[0]?.fileName || null,
        similarity: 0.8,
      };
    }
  },
};

// checkPermission(automationMutations, 'automationsAdd', 'automationsAdd');
// checkPermission(automationMutations, 'automationsEdit', 'automationsEdit');
// checkPermission(automationMutations, 'automationsRemove', 'automationsRemove');
