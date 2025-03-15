import { IModels } from "backend/core-api/src/connectionResolvers";
import { IFormSubmission, IFormSubmissionDocument } from "../../../modules/form/types";
import { Model } from "mongoose";
import { formSubmissionSchema } from "../../definitions/form/submission";

export interface IFormSubmissionModel extends Model<IFormSubmissionDocument> {
    createFormSubmission(doc: IFormSubmission): Promise<IFormSubmissionDocument>;
  }
  
  export const loadFormSubmissionClass = (models: IModels) => {
    class FormSubmission {
      /**
       * Creates a form document
       */
      public static async createFormSubmission(doc: IFormSubmission) {
        return models.FormSubmissions.create(doc);
      }
    }
  
    formSubmissionSchema.loadClass(FormSubmission);
  
    return formSubmissionSchema;
  };
  