import { IContext } from 'core-api/@types';
import { ICompany } from 'erxes-core-types';

export const companyMutations = {
  /**
   * Creates a new company
   */
  async companiesAdd(_root, doc: ICompany, { models, user }: IContext) {
    return await models.Companies.createCompany(doc, user);
  },

  /**
   * Updates a company
   */
  async companiesEdit(
    _parent: undefined,
    { _id, ...doc }: { _id: string } & ICompany,
    { models }: IContext,
  ) {
    return await models.Companies.updateCompany(_id, doc);
  },

  /**
   * Removes companies
   */
  async companiesRemove(
    _parent: undefined,
    { companyIds }: { companyIds: string[] },
    { models }: IContext,
  ) {
    await models.Companies.removeCompanies(companyIds);

    return companyIds;
  },

  /**
   * Merge companies
   */
  async companiesMerge(
    _parent: undefined,
    {
      companyIds,
      companyFields,
    }: { companyIds: string[]; companyFields: ICompany },
    { models }: IContext,
  ) {
    return models.Companies.mergeCompanies(companyIds, companyFields);
  },
};
