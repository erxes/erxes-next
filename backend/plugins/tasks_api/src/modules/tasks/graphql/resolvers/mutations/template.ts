import * as _ from "underscore";

import { IContext } from "~/connectionResolvers";
import {
  checkPermission,
  moduleRequireLogin
} from "erxes-api-shared/core-modules/permissions/utils";
import { IPipelineTemplate, IPipelineTemplateStage } from "~/modules/tasks/@types/template";

interface IPipelineTemplatesEdit extends IPipelineTemplate {
  _id: string;
  stages: IPipelineTemplateStage[];
}

const pipelineTemplateMutations = {
  /**
   * Create new pipeline template
   */
  async tasksPipelineTemplatesAdd(
    _root,
    { stages, ...doc }: IPipelineTemplate,
    { /*docModifier*/models }: IContext
  ) {
    const pipelineTemplate = await models.PipelineTemplates.createPipelineTemplate(
      /*docModifier({ createdBy: user._id, ...doc }),*/
      stages
    );

    return pipelineTemplate;
  },

  /**
   * Edit pipeline template
   */
  async tasksPipelineTemplatesEdit(
    _root,
    { _id, stages, ...doc }: IPipelineTemplatesEdit,
    { models }: IContext
  ) {
    await models.PipelineTemplates.getPipelineTemplate(_id);

    const updated = await models.PipelineTemplates.updatePipelineTemplate(
      _id,
      doc,
      stages
    );

    return updated;
  },

  /**
   * Duplicate pipeline template
   */
  async tasksPipelineTemplatesDuplicate(
    _root,
    { _id }: { _id: string },
    {  models }: IContext
  ) {
    await models.PipelineTemplates.getPipelineTemplate(_id);

    return models.PipelineTemplates.duplicatePipelineTemplate(_id);
  },

  /**
   * Remove pipeline template
   */
  async tasksPipelineTemplatesRemove(
    _root,
    { _id }: { _id: string },
    {  models }: IContext
  ) {
    await models.PipelineTemplates.getPipelineTemplate(_id);

    return models.PipelineTemplates.removePipelineTemplate(_id);
  }
};

// Enforce login on all resolvers
moduleRequireLogin(pipelineTemplateMutations);

// Attach permissions
checkPermission(pipelineTemplateMutations, "tasks", "", [
  ["tasksPipelineTemplatesAdd", "taskPipelinesAdd"],
  ["tasksPipelineTemplatesEdit", "taskPipelinesEdit"],
  ["tasksPipelineTemplatesRemove", "taskPipelinesRemove"],
  ["tasksPipelineTemplatesDuplicate", "taskPipelinesCopied"]
]);

export default pipelineTemplateMutations;
