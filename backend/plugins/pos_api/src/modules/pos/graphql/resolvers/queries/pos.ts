import { getBranchesUtil } from "@/pos/utils";
import { IContext } from "~/connectionResolvers";
import { paginate } from "./orders";

const generateFilterQuery = async ({ isOnline }, commonQuerySelector) => {
  const query: any = { ...commonQuerySelector, status: { $ne: 'deleted' } };
  if (isOnline) {
    query.isOnline = isOnline === 'online';
  }

  return query;
};

const queries = {
  posEnv: async () => {
    const { ALL_AUTO_INIT } = process.env;
    return {
      ALL_AUTO_INIT: [true, 'true', 'True', '1'].includes(ALL_AUTO_INIT || '')
    };
  },

  posList: async (_root, params, { commonQuerySelector, models }) => {
    const query = await generateFilterQuery(params, commonQuerySelector);

    const posList = paginate(models.Pos.find(query), params);

    return posList;
  },

  posDetail: async (_root, { _id }, { models }) => {
    return await models.Pos.getPos({ $or: [{ _id }, { token: _id }] });
  },

  ecommerceGetBranches: async (
    _root,
    { posToken },
    { models, subdomain }: IContext
  ) => {
    return await getBranchesUtil(subdomain, models, posToken);
  },

  productGroups: async (
    _root,
    { posId }: { posId: string },
    { models }: IContext
  ) => {
    return await models.ProductGroups.groups(posId);
  },

  posSlots: async (
    _root,
    { posId }: { posId: string },
    { models }: IContext
  ) => {
    return await models.PosSlots.find({ posId }).lean();
  }
};

// checkPermission(queries, 'posList', 'showPos');
// checkPermission(queries, 'posDetail', 'showPos');
// checkPermission(queries, 'productGroups', 'managePos');

export default queries;
