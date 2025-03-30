import { IContext } from 'core-api/@types';
import { ICompany } from 'core-api/modules/contacts/@types/company';

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
    _root,
    { _id, ...doc }: { _id: string } & ICompany,
    { models }: IContext,
  ) {
    return await models.Companies.updateCompany(_id, doc);
  },

  /**
   * Removes companies
   */
  async companiesRemove(
    _root,
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
    _root,
    {
      companyIds,
      companyFields,
    }: { companyIds: string[]; companyFields: ICompany },
    { models }: IContext,
  ) {
    return models.Companies.mergeCompanies(companyIds, companyFields);
  },
};
