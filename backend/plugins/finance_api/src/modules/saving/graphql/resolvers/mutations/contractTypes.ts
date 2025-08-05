import { IContext } from '~/connectionResolvers';
import {
  IContractType,
  IContractTypeDocument,
} from '~/modules/saving/@types/contractTypes';

const contractTypeMutations = {
  savingsContractTypesAdd: async (
    _root: undefined,
    doc: IContractType,
    { models }: IContext,
  ) => {
    return await models.ContractTypes.createContractType(doc);
  },

  /**
   * Updates a contractType
   */

  savingsContractTypesEdit: async (
    _root: undefined,
    { _id, ...doc }: IContractTypeDocument,
    { models }: IContext,
  ) => {
    return await models.ContractTypes.updateContractType(_id, doc);
  },

  /**
   * Removes contractTypes
   */

  savingsContractTypesRemove: async (
    _root: undefined,
    { contractTypeIds }: { contractTypeIds: string[] },
    { models }: IContext,
  ) => {
    // TODO: contracts check
    // const contractTypes = await models.ContractTypes.find({
    //   _id: { $in: contractTypeIds },
    // }).lean();

    return await models.ContractTypes.removeContractTypes(contractTypeIds);
  },
};

export default contractTypeMutations;
