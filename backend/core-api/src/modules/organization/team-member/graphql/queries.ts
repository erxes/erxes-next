import { IContext } from '../../../../connectionResolvers';
import { USER_ROLES } from 'erxes-core-modules';
import { IUserDocument } from 'erxes-core-types';
import { IModels } from '../../../../connectionResolvers';
import { paginate } from 'erxes-api-utils';

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
  user: IUserDocument,
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
    segmentData,
  } = params;

  const selector: any = {
    isActive,
  };

  if (searchValue) {
    const fields = [
      { email: new RegExp(`.*${params.searchValue}.*`, 'i') },
      { employeeId: new RegExp(`.*${params.searchValue}.*`, 'i') },
      { username: new RegExp(`.*${params.searchValue}.*`, 'i') },
      { 'details.fullName': new RegExp(`.*${params.searchValue}.*`, 'i') },
      { 'details.position': new RegExp(`.*${params.searchValue}.*`, 'i') },
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
  async userMovements(_parent, args, { models }: IContext) {
    return await models.UserMovements.find(args).sort({ createdAt: -1 });
  },
  async usersTotalCount(
    _parent: undefined,
    args: IListArgs,
    { models, subdomain, user }: IContext,
  ) {
    const selector = {
      ...(await queryBuilder(models, args, subdomain, user)),
      ...NORMAL_USER_SELECTOR,
    };

    return models.Users.find(selector).countDocuments();
  },

  async userDetail(
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.Users.findOne({ _id });
  },

  async allUsers(
    _parent: undefined,
    {
      isActive,
      ids,
      assignedToMe,
    }: { isActive: boolean; ids: string[]; assignedToMe: string },
    { user, models }: IContext,
  ) {
    const selector: { isActive?: boolean; _id?: any } = {};

    if (isActive) {
      selector.isActive = true;
    }
    if (ids?.length) {
      selector._id = { $in: ids };
    }
    if (assignedToMe === 'true') {
      selector._id = user._id;
    }

    return models.Users.find({ ...selector, ...NORMAL_USER_SELECTOR }).sort({
      username: 1,
    });
  },

  async users(
    _parent: undefined,
    args: IListArgs,
    { models, subdomain, user }: IContext,
  ) {
    const selector = {
      ...(await queryBuilder(models, args, subdomain, user)),
      ...NORMAL_USER_SELECTOR,
    };

    const { sortField, sortDirection } = args;

    const sort =
      sortField && sortDirection
        ? { [sortField]: sortDirection }
        : { username: 1 };

    return paginate(models.Users.find(selector).sort(sort as any), args);
  },
};
