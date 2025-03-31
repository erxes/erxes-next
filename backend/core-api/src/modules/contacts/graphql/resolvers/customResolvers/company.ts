import { IContext } from 'core-api/@types';
import { ICompanyDocument } from 'erxes-core-types';

export default {
  owner: async (company: ICompanyDocument, _, { models }: IContext) => {
    if (!company.ownerId) {
      return;
    }

    return models.Users.findOne({ _id: company.ownerId }) || {};
  },

  parentCompany: async (
    { parentCompanyId }: ICompanyDocument,
    _,
    { models }: IContext,
  ) => {
    return models.Companies.findOne({ _id: parentCompanyId });
  },
};
