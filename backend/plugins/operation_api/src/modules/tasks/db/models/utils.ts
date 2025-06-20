import { validSearchText } from 'erxes-api-shared/utils';
import { DeleteResult } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IPipeline } from '~/modules/tasks/@types/pipelines';
import { IStage, IStageDocument } from '~/modules/tasks/@types/stages';
import { ITask } from '~/modules/tasks/@types/tasks';
import { configReplacer } from '~/modules/tasks/utils';

const numberCalculator = (size: number, num?: any, skip?: boolean) => {
  if (num && !skip) {
    num = parseInt(num, 10) + 1;
  }

  if (skip) {
    num = 0;
  }

  num = num.toString();

  while (num.length < size) {
    num = '0' + num;
  }

  return num;
};

export const boardNumberGenerator = async (
  models: IModels,
  config: string,
  size: string,
  skip: boolean,
  type?: string,
) => {
  const replacedConfig = await configReplacer(config);
  const re = replacedConfig + '[0-9]+$';

  let number;

  if (!skip) {
    const pipeline = await models.Pipelines.findOne({
      lastNum: new RegExp(re),
      type,
    });

    if (pipeline?.lastNum) {
      const lastNum = pipeline.lastNum;

      const lastGeneratedNumber = lastNum.slice(replacedConfig.length);

      number =
        replacedConfig +
        (await numberCalculator(parseInt(size, 10), lastGeneratedNumber));

      return number;
    }
  }

  number =
    replacedConfig + (await numberCalculator(parseInt(size, 10), '', skip));

  return number;
};

export const generateLastNum = async (models: IModels, doc: IPipeline) => {
  const replacedConfig = await configReplacer(doc.numberConfig);
  const re = replacedConfig + '[0-9]+$';

  const pipeline = await models.Pipelines.findOne({
    lastNum: new RegExp(re),
  });

  if (pipeline) {
    return pipeline.lastNum;
  }

  const task = await models.Tasks.findOne({
    number: new RegExp(re),
  }).sort({ createdAt: -1 });

  if (task) {
    return task.number;
  }

  // generate new number by new numberConfig
  const generatedNum = await boardNumberGenerator(
    models,
    doc.numberConfig || '',
    doc.numberSize || '',
    true,
  );

  return generatedNum;
};

export const fillSearchTextItem = (doc: ITask, item?: ITask) => {
  const document = item || { name: '', description: '' };
  Object.assign(document, doc);

  return validSearchText([document.name || '', document.description || '']);
};

export const removeTasks = async (models: IModels, stageIds: string[]) => {
  const taskIds = await models.Tasks.find({
    stageId: { $in: stageIds },
  }).distinct('_id');

  await models.Checklists.removeChecklists(taskIds);

  await models.Tasks.deleteMany({ _id: { $in: taskIds } });
};

export const removeStages = async (models: IModels, pipelineIds: string[]) => {
  const stageIds = await models.Stages.find({
    pipelineId: { $in: pipelineIds },
  }).distinct('_id');

  await removeTasks(models, stageIds);

  await models.Stages.deleteMany({ _id: { $in: stageIds } });
};

export const removePipelines = async (models: IModels, boardIds: string[]) => {
  const pipelineIds = await models.Pipelines.find({
    boardId: { $in: boardIds },
  }).distinct('_id');

  await removeStages(models, pipelineIds);

  await models.Pipelines.deleteMany({ _id: { $in: pipelineIds } });
};

export const createOrUpdatePipelineStages = async (
  models: IModels,
  pipelineId: string,
  stages?: IStageDocument[],
): Promise<DeleteResult> => {
  if (!stages) {
    return models.Stages.deleteMany({ pipelineId });
  }

  const validStageIds: string[] = [];

  const bulkOpsPrevEntry: Array<{
    updateOne: {
      filter: { _id: string };
      update: { $set: IStage };
    };
  }> = [];

  const stageIds = stages.map((stage) => stage._id);

  // fetch stage from database
  const inStageIds = await models.Stages.find({
    _id: { $in: stageIds },
  }).distinct('_id');

  const outStageIds = await models.Stages.find({
    pipelineId,
    _id: { $nin: stageIds },
  }).distinct('_id');

  await models.Tasks.deleteMany({ stageId: { $in: outStageIds } });

  await models.Stages.deleteMany({ pipelineId, _id: { $nin: stageIds } });

  let order = 0;

  for (const stage of stages) {
    order++;

    const doc: any = { ...stage, order, pipelineId };

    const _id = doc._id;

    const validStage = inStageIds.includes(_id);

    // edit
    if (validStage) {
      validStageIds.push(_id);

      bulkOpsPrevEntry.push({
        updateOne: {
          filter: {
            _id,
          },
          update: {
            $set: doc,
          },
        },
      });
      // create
    } else {
      doc._id = undefined;

      const stage = await models.Stages.createStage(doc);

      validStageIds.push(stage._id);
    }
  }

  if (bulkOpsPrevEntry.length > 0) {
    await models.Stages.bulkWrite(bulkOpsPrevEntry);
  }

  return models.Stages.deleteMany({ pipelineId, _id: { $nin: validStageIds } });
};
