import { IModels } from '../../connectionResolvers';
import { STRUCTURE_STATUSES } from './constants';

export const generateFilters = async ({
  models,
  user,
  type,
  params,
}: {
  models: IModels;
  user: any;
  type: string;
  params: any;
}) => {
  const filter: any = { status: { $ne: STRUCTURE_STATUSES.DELETED } };

  if (params?.ids?.length) {
    filter._id = { [params.excludeIds ? '$nin' : '$in']: params.ids };
  }

  if (params.status) {
    filter.status = params.status;
  }

  if (filter.order && user.isOwner) {
    delete filter.order;
  }

  if (params.searchValue) {
    const regexOption = {
      $regex: `.*${params.searchValue.trim()}.*`,
      $options: 'i',
    };

    const structureFilter: any = {
      $or: [
        { title: regexOption },
        { description: regexOption },
        { code: regexOption },
      ],
    };

    if (filter.order) {
      structureFilter.order = filter.order;
    }

    if (type === 'department') {
      const departmentOrders = (await models.Departments.find(structureFilter))
        .map((department) => department.code)
        .join('|');
      filter.order = { $regex: new RegExp(departmentOrders) };
    }

    if (type === 'branch') {
      const branchOrders = (await models.Branches.find(structureFilter))
        .map((department) => department.code)
        .join('|');
      filter.order = { $regex: new RegExp(branchOrders, 'i') };
    }

    if (type === 'position' && params.searchValue) {
      return { $and: [filter, structureFilter] };
    }
  }

  if (params.onlyFirstLevel) {
    filter.parentId = { $in: [null, ''] };
  }

  if (params?.parentId) {
    filter.parentId = params.parentId;
  }

  return filter;
};
