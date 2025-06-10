// modules/tasks/resolvers/taskResolver.ts
import { sendTRPCMessage } from "erxes-api-shared/utils";
import { IContext } from "~/connectionResolvers";
import { ITaskDocument } from "~/modules/tasks/@types/task";


// Helper to get boardId from task
async function boardId(models: IContext['models'], task: ITaskDocument) {
  const stage = await models.Stages.getStage(task.stageId);
  if (!stage) return null;

  const pipeline = await models.Pipelines.findOne({ _id: stage.pipelineId });
  return pipeline?.boardId || null;
}

export default {
  async __resolveReference({ _id }, { models }: IContext) {
    return models.Tasks.findOne({ _id });
  },

  async companies(task: ITaskDocument, _args: undefined, { isSubscription }) {
    const input = {
      mainType: "task",
      mainTypeId: task._id,
      relTypes: ["company"]
    };

    const companyIds = await sendTRPCMessage({
      pluginName: "core",
      method: "query",
      module: "conformity",
      action: "savedConformity",
      input,
      defaultValue: []
    });

    const activeCompanies = await sendTRPCMessage({
      pluginName: "contacts",
      method: "query",
      module: "companies",
      action: "findActiveCompanies",
      input: { _ids: companyIds },
      defaultValue: []
    });

    return isSubscription
      ? activeCompanies
      : (activeCompanies ?? []).map(({ _id }) => ({
          __typename: "Company",
          _id
        }));
  },

  createdUser(task: ITaskDocument) {
    return task.userId ? { __typename: "User", _id: task.userId } : null;
  },

  async customers(task: ITaskDocument, _args, { isSubscription }) {
    const input = {
      mainType: "task",
      mainTypeId: task._id,
      relTypes: ["customer"]
    };

    const customerIds = await sendTRPCMessage({
      pluginName: "core",
      method: "query",
      module: "conformity",
      action: "savedConformity",
      input,
      defaultValue: []
    });

    const customers = await sendTRPCMessage({
      pluginName: "contacts",
      method: "query",
      module: "customers",
      action: "findActiveCustomers",
      input: { _ids: customerIds },
      defaultValue: []
    });

    return isSubscription
      ? customers
      : (customers ?? []).map(({ _id }) => ({
          __typename: "Customer",
          _id
        }));
  },

  async assignedUsers(task: ITaskDocument, _args, { isSubscription }) {
    if (isSubscription && (task.assignedUserIds?.length ?? 0) > 0) {
      return sendTRPCMessage({
        pluginName: "core",
        method: "query",
        module: "users",
        action: "find",
        input: { _ids: task.assignedUserIds },
        defaultValue: []
      });
    }

    return (task.assignedUserIds ?? []).filter(Boolean).map(_id => ({
      __typename: "User",
      _id
    }));
  },

  async pipeline(task: ITaskDocument, _args, { models: { Stages, Pipelines } }: IContext) {
    const stage = await Stages.getStage(task.stageId);
    return stage?.pipelineId
      ? Pipelines.findOne({ _id: stage.pipelineId })
      : null;
  },

  async boardId(task: ITaskDocument, _args: undefined, { models }: IContext) {
    return boardId(models, task);
  },

  async stage(task: ITaskDocument, _args, { models: { Stages } }: IContext) {
    return Stages.getStage(task.stageId);
  },

  async isWatched(task: ITaskDocument, _args: undefined, { user }: IContext) {
    return user?._id && (task.watchedUserIds ?? []).includes(user._id);
  },

  async tags(task: ITaskDocument) {
    return (task.tagIds ?? []).filter(Boolean).map(_id => ({
      __typename: "Tag",
      _id
    }));
  },

  async labels(task: ITaskDocument, _args, { models: { PipelineLabels } }: IContext) {
    return PipelineLabels.find({ _id: { $in: task.labelIds ?? [] } });
  }
};
