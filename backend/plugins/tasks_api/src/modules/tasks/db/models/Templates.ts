import { sendTRPCMessage } from "erxes-api-shared/utils/trpc";
import { pipelineTemplateSchema } from "../definitions/templates";
import { IPipelineTemplateStage } from "../../@types/template";
import { IModels } from "~/connectionResolvers";
import { IPipelineTemplateDocument } from "../../@types/templateDocument";
import { Model } from "mongoose";

interface IDoc {
  name: string;
  description?: string;
  type: string;
}

export const getDuplicatedStages = async (
  models: IModels,
  {
    templateId,
    pipelineId,
    type
  }: {
    templateId: string;
    pipelineId?: string;
    type?: string;
  }
) => {
  const template = await models.PipelineTemplates.getPipelineTemplate(templateId);
  const stages: any[] = [];

  for (const stage of template.stages) {
    const duplicated = await sendTRPCMessage({
      pluginName: "formBuilder",
      method: "mutation",
      module: "forms",
      action: "duplicate",
      input: { formId: stage.formId },
      defaultValue: {},
      options: {}
    });
    
    stages.push({
      _id: Math.random().toString(),
      name: stage.name,
      pipelineId,
      type,
      formId: duplicated._id
    });
  }

  return stages;
};

export interface IPipelineTemplateModel extends Model<IPipelineTemplateDocument> {
  getPipelineTemplate(_id: string): Promise<IPipelineTemplateDocument>;
  createPipelineTemplate(doc: IDoc, stages: IPipelineTemplateStage[]): Promise<IPipelineTemplateDocument>;
  updatePipelineTemplate(_id: string, doc: IDoc, stages: IPipelineTemplateStage[]): Promise<IPipelineTemplateDocument>;
  removePipelineTemplate(_id: string): Promise<void>; // Updated return type
  duplicatePipelineTemplate(_id: string): Promise<IPipelineTemplateDocument>;
}

export const loadPipelineTemplateClass = (models: IModels) => {
  class PipelineTemplate {
    /**
     * Get a pipeline template
     */
    public static async getPipelineTemplate(_id: string) {
      const pipelineTemplate = await models.PipelineTemplates.findOne({ _id });

      if (!pipelineTemplate) {
        throw new Error("Pipeline template not found");
      }

      return pipelineTemplate;
    }

    /**
     * Create a pipeline template
     */
    public static async createPipelineTemplate(doc: IDoc, stages: IPipelineTemplateStage[]) {
      const orderedStages = stages.map((stage, index) => ({ ...stage, index }));
      return models.PipelineTemplates.create({ ...doc, stages: orderedStages });
    }

    /**
     * Update a pipeline template
     */
    public static async updatePipelineTemplate(_id: string, doc: IDoc, stages: IPipelineTemplateStage[]) {
      const orderedStages = stages.map((stage, index) => ({ ...stage, index }));

      await models.PipelineTemplates.updateOne({ _id }, { $set: { ...doc, stages: orderedStages } });

      return models.PipelineTemplates.findOne({ _id });
    }

    /**
     * Duplicate a pipeline template
     */
    public static async duplicatePipelineTemplate(_id: string) {
      const pipelineTemplate = await models.PipelineTemplates.findOne({ _id }).lean();

      if (!pipelineTemplate) {
        throw new Error("Pipeline template not found");
      }

      const duplicatedDoc: IDoc = {
        name: `${pipelineTemplate.name} duplicated`,
        description: pipelineTemplate.description || "",
        type: pipelineTemplate.type
      };

      const stages = await getDuplicatedStages(models, { templateId: pipelineTemplate._id });

      return models.PipelineTemplates.createPipelineTemplate(duplicatedDoc, stages);
    }

    /**
     * Remove a pipeline template
     */
    public static async removePipelineTemplate(_id: string): Promise<void> {
      const pipelineTemplate = await models.PipelineTemplates.findOne({ _id });

      if (!pipelineTemplate) {
        throw new Error("Pipeline template not found");
      }

      // Delete all associated forms first
      for (const stage of pipelineTemplate.stages) {
        await sendTRPCMessage({
          pluginName: "formBuilder",
          method: "mutation",
          module: "forms",
          action: "removeForm",
          input: { formId: stage.formId },
          defaultValue: {},
          options: {}
        });
      }

      // Delete the template after all forms are removed
      await models.PipelineTemplates.deleteOne({ _id });
    }
  } // Fixed missing class closing brace

  // Corrected schema loading
  pipelineTemplateSchema.loadClass(PipelineTemplate);
  return pipelineTemplateSchema;
};