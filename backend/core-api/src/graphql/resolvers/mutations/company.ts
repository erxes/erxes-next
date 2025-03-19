import { IContext } from 'backend/core-api/src/connectionResolvers';
import { ICompany } from 'erxes-api-utils';

interface ICompaniesEdit extends ICompany {
  _id: string;
}

export const companyMutations = {
  /**
   * Creates a new company
   */
  async companiesAdd(
    _root,
    doc: ICompany,
    { user, docModifier, models, subdomain }: IContext,
  ) {
    const company = await models.Companies.createCompany(
      docModifier(doc),
      user,
    );

    return company;
  },

  /**
   * Updates a company
   */
  async companiesEdit(
    _root,
    { _id, ...doc }: ICompaniesEdit,
    { user, models, subdomain }: IContext,
  ) {
    const company = await models.Companies.getCompany(_id);
    const updated = await models.Companies.updateCompany(_id, doc);

    return updated;
  },

  /**
   * Finding customer to update by searching primaryEmail,primarPhone etc ...
   */
  async companiesEditByField(
    _root,
    {
      selector,
      doc,
    }: {
      selector: {
        primaryName?: string;
        primaryEmail?: string;
        primaryPhone?: string;
        code?: string;
      };
      doc: ICompaniesEdit;
    },
    { models }: IContext,
  ) {
    let company;

    if (selector.primaryEmail) {
      company = await models.Companies.findOne({
        primaryEmail: selector.primaryEmail,
      }).lean();
    }

    if (!company && selector.primaryPhone) {
      company = await models.Companies.findOne({
        primarPhone: selector.primaryPhone,
      }).lean();
    }

    if (!company && selector.code) {
      company = await models.Companies.findOne({ code: selector.code }).lean();
    }

    if (!company && selector.primaryName) {
      company = await models.Companies.findOne({
        primaryName: selector.primaryName,
      }).lean();
    }

    if (!company) {
      throw new Error('Company not found');
    }

    return models.Companies.updateCompany(company._id, doc);
  },

  /**
   * Removes companies
   */
  async companiesRemove(
    _root,
    { companyIds }: { companyIds: string[] },
    { user, models, subdomain }: IContext,
  ) {
    const companies = await models.Companies.find({
      _id: { $in: companyIds },
    }).lean();

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
    { models: { Companies } }: IContext,
  ) {
    return Companies.mergeCompanies(companyIds, companyFields);
  },
};

export default companyMutations;
