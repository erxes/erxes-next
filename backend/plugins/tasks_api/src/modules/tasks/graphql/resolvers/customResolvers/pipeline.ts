import { IContext } from "~/connectionResolvers";
import { IPipelineDocument } from "~/modules/tasks/@types/pipeline";
import { VISIBILITIES } from "~/modules/tasks/constants";
import { generateCommonFilters } from "~/modules/tasks/utils";


export default {
    createdUser(pipeline: IPipelineDocument) {
      if (!pipeline.userId) {
        return;
      }
  
      return { __typename: "User", _id: pipeline.userId };
    },
  
    members(pipeline: IPipelineDocument) {
      if (pipeline.visibility === VISIBILITIES.PRIVATE && pipeline.memberIds) {
        return pipeline.memberIds.map(memberId => ({
          __typename: "User",
          _id: memberId
        }));
      }
  
      return [];
    },
  
    isWatched(pipeline: IPipelineDocument, _args: undefined, { user }: IContext) {
      const watchedUserIds = pipeline.watchedUserIds || [];
  
      if (watchedUserIds.includes(user._id)) {
        return true;
      }
  
      return false;
    },
  
    state(pipeline: IPipelineDocument) {
      if (pipeline.startDate && pipeline.endDate) {
        const now = new Date().getTime();
  
        const startDate = new Date(pipeline.startDate).getTime();
        const endDate = new Date(pipeline.endDate).getTime();
  
        if (now > endDate) {
          return "Completed";
        } else if (now < endDate && now > startDate) {
          return "In progress";
        } else {
          return "Not started";
        }
      }
  
      return '';
    },
  
    async itemsTotalCount(
      pipeline: IPipelineDocument,
      _args: undefined,
      { user, models }: IContext
    ) {

      const filter = await generateCommonFilters (
            models,
            user._id,
            {
              pipelineId: pipeline._id
            }
          );
  
          return models.Tasks.find(filter).countDocuments();
        },
      

  
    async tag(pipeline: IPipelineDocument) {
      if (pipeline.tagId) {
        return {
          __typename: "Tag",
          _id: pipeline.tagId
        };
      }
    }
  };
  