import { IContext } from '../../../../@types';
import { IUserDocument, USER_ROLES} from 'erxes-api-modules';
import { IModels } from '../../../../connectionResolvers';

interface IListArgs {
  page?: number;
  perPage?: number;
  sortDirection?: number;
  sortField?: string;
  searchValue?: string;
  excludeIds?: boolean;
  isActive?: boolean;
  requireUsername: boolean;
  ids?: string[];
  email?: string;
  status?: string;
  brandIds?: string[];
  departmentId?: string;
  branchId?: string;
  isAssignee?: boolean;
  departmentIds: string[];
  branchIds: string[];
  unitId?: string;
  segment?: string;
  segmentData?: string;
}


const NORMAL_USER_SELECTOR = { role: { $ne: USER_ROLES.SYSTEM } };

const queryBuilder = async (
  models: IModels,
  params: IListArgs,
  subdomain: string,
  user: IUserDocument
) => {
  const {
    searchValue,
    isActive,
    requireUsername,
    ids,
    status,
    excludeIds,
    brandIds,
    departmentId,
    unitId,
    branchId,
    isAssignee,
    departmentIds,
    branchIds,
    segment,
    segmentData
  } = params;

  const selector: any = {
    isActive
  };


  if (searchValue) {
    const fields = [
      { email: new RegExp(`.*${params.searchValue}.*`, "i") },
      { employeeId: new RegExp(`.*${params.searchValue}.*`, "i") },
      { username: new RegExp(`.*${params.searchValue}.*`, "i") },
      { "details.fullName": new RegExp(`.*${params.searchValue}.*`, "i") },
      { "details.position": new RegExp(`.*${params.searchValue}.*`, "i") }
    ];

    selector.$or = fields;
  }

  if (requireUsername) {
    selector.username = { $ne: null };
  }

  if (isActive === undefined || isActive === null) {
    selector.isActive = true;
  }

  if (ids && ids.length > 0) {
    if (excludeIds) {
      selector._id = { $nin: ids };
    } else {
      return { _id: { $in: ids }, isActive: true };
    }
  }

  if (status) {
    selector.registrationToken = { $eq: null };
  }

  if (brandIds && brandIds.length > 0) {
    selector.brandIds = { $in: brandIds };
  }

  if (branchId) {
    selector.branchIds = { $in: [branchId] };
  }

  if (departmentId) {
    selector.departmentIds = { $in: [departmentId] };
  }

  return selector;
};
export const userQueries = {
  async userMovements(_root, args, { models }: IContext) {
    return await models.UserMovements.find(args).sort({ createdAt: -1 });
  },
  async usersTotalCount(
    _root,
    args: IListArgs,
    { userBrandIdsSelector, models, subdomain, user }: IContext
  ) {
    const selector = {
      ...userBrandIdsSelector,
      ...(await queryBuilder(models, args, subdomain, user)),
      ...NORMAL_USER_SELECTOR
    };

    return models.Users.find(selector).countDocuments();
  },
  async userDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.Users.findOne({ _id });
  },

  async allUsers(
    _root,
    {
      isActive,
      ids,
      assignedToMe
    }: { isActive: boolean; ids: string[]; assignedToMe: string },
    { userBrandIdsSelector, user, models }: IContext
  ) {
    const selector: { isActive?: boolean; _id?: any } = userBrandIdsSelector;

    if (isActive) {
      selector.isActive = true;
    }
    if (ids?.length) {
      selector._id = { $in: ids };
    }
    if (assignedToMe === "true") {
      selector._id = user._id;
    }

    return models.Users.find({ ...selector, ...NORMAL_USER_SELECTOR }).sort({
      username: 1
    });
  },

  async users(
    _root,
    args: IListArgs,
    { userBrandIdsSelector, models, subdomain, user }: IContext
  ) {
    const selector = {
      ...userBrandIdsSelector,
      ...(await queryBuilder(models, args, subdomain, user)),
      ...NORMAL_USER_SELECTOR
    };

    const { sortField, sortDirection } = args;

    const sort =
      sortField && sortDirection
        ? { [sortField]: sortDirection }
        : { username: 1 };

    return (models.Users.find(selector).sort(sort as any), args);
  },

};
